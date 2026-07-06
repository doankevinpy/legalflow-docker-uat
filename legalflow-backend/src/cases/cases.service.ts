import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { QueryCasesDto } from './dto/query-cases.dto';
import { AddCaseNoteDto } from './dto/add-case-note.dto';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';
import { ChangeCaseStatusDto } from './dto/change-case-status.dto';
import { CaseHistoryAction, CaseField, CaseStatus } from './enums/case.enum';
import { Role } from '../common/role.enum';
import { AI_REVIEW_WARNING } from '../common/constants';
import { Prisma, AiActionType, AiLogStatus, AiFeedbackStatus } from '@prisma/client';
import { Packer } from 'docx';
import { identifyTemplateGroup, buildDocxDocument, cleanDraftBodyLines } from './docx-templates.helper';
import { getAgencyConfig } from '../config/agency.config';

@Injectable()
export class CasesService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  private getDefaultChecklist(field: CaseField): { title: string }[] {
    switch (field) {
      case CaseField.DAT_DAI:
        return [
          { title: 'Kiểm tra Giấy chứng nhận QSDĐ' },
          { title: 'Trích lục bản đồ địa chính' },
        ];
      case CaseField.DAN_SU:
        return [
          { title: 'Xác minh nhân thân' },
          { title: 'Thu thập tài liệu chứng cứ' },
        ];
      default:
        return [
          { title: 'Tiếp nhận đơn' },
          { title: 'Kiểm tra tài liệu kèm theo' },
        ];
    }
  }

  private checkStaffAccess(caseObj: any, user: any) {
    if (user.role === Role.STAFF) {
      if (caseObj.assignedToId !== user.id && caseObj.createdById !== user.id) {
        throw new ForbiddenException(
          'STAFF can only modify their own or assigned cases',
        );
      }
    }
  }

  async create(createCaseDto: CreateCaseDto, user: any) {
    const { documents, assignedToId, receivedDate, ...rest } = createCaseDto;

    // Staff auto-assign if not provided
    let finalAssignedToId = assignedToId;
    if (user.role === Role.STAFF && !finalAssignedToId) {
      finalAssignedToId = user.id;
    }

    let createdCase = null;
    let retries = 0;

    while (retries < 5) {
      try {
        createdCase = await this.prisma.$transaction(async (tx) => {
          const seqYear = receivedDate
            ? new Date(receivedDate).getFullYear()
            : new Date().getFullYear();

          // Atomic upsert to prevent race condition on concurrent case creation
          const seq = await tx.caseSequence.upsert({
            where: { year: seqYear },
            create: { year: seqYear, lastSequence: 1 },
            update: { lastSequence: { increment: 1 } },
          });

          const seqStr = seq.lastSequence.toString().padStart(3, '0');
          const code = `${seqYear}-${rest.type}-${seqStr}-${rest.neighborhood}`;

          const newCase = await tx.legalCase.create({
            data: {
              ...rest,
              caseCode: code,
              documents: (documents ?? []) as unknown as Prisma.InputJsonValue,
              receivedDate: receivedDate ? new Date(receivedDate) : undefined,
              deadline: rest.deadline ? new Date(rest.deadline) : undefined,
              assignedToId: finalAssignedToId,
              createdById: user.id,
              checklist: {
                create: this.getDefaultChecklist(rest.field),
              },
              histories: {
                create: {
                  userId: user.id,
                  action: CaseHistoryAction.CREATE_CASE,
                  details: { message: 'Case created' },
                },
              },
            },
          });
          return newCase;
        });
        break;
      } catch (err: any) {
        if (err.code === 'P2002') {
          retries++;
          continue;
        }
        throw err;
      }
    }

    if (!createdCase) {
      throw new InternalServerErrorException(
        'Cannot generate unique case code',
      );
    }

    return this.findOne(createdCase.id);
  }

  async findAll(query: QueryCasesDto) {
    const {
      search,
      status,
      type,
      field,
      neighborhood,
      assignedToId,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.LegalCaseWhereInput = {
      deletedAt: null,
    };

    if (status) where.status = status;
    if (type) where.type = type;
    if (field) where.field = field;
    if (neighborhood) where.neighborhood = neighborhood;
    if (assignedToId) where.assignedToId = assignedToId;

    if (search) {
      where.OR = [
        { caseCode: { contains: search, mode: 'insensitive' } },
        { senderName: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, data] = await Promise.all([
      this.prisma.legalCase.count({ where }),
      this.prisma.legalCase.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          assignedTo: { select: { id: true, fullName: true, email: true } },
          createdBy: { select: { id: true, fullName: true, email: true } },
        },
      }),
    ]);

    // parse documents JSON string back to object array if it's a string (SQLite fallback), otherwise use directly
    const mappedData = data.map((c) =>
      this.sanitizeCaseResponse({
        ...c,
        documents:
          typeof c.documents === 'string'
            ? JSON.parse(c.documents)
            : c.documents || [],
      }),
    );

    return {
      data: mappedData,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private sanitizeDocument(doc: any) {
    if (!doc) return doc;
    const { minioKey, ...safeDoc } = doc;
    return safeDoc;
  }

  private sanitizeDocuments(documents: any) {
    const docsArray = Array.isArray(documents)
      ? documents
      : typeof documents === 'string'
        ? JSON.parse(documents)
        : [];
    return docsArray.map((doc: any) => this.sanitizeDocument(doc));
  }

  private sanitizeCaseResponse(caseObj: any) {
    if (!caseObj) return caseObj;
    return {
      ...caseObj,
      documents: this.sanitizeDocuments(caseObj.documents),
    };
  }

  async findOneInternal(id: string) {
    const caseObj = await this.prisma.legalCase.findFirst({
      where: { id, deletedAt: null },
      include: {
        assignedTo: { select: { id: true, fullName: true, email: true } },
        createdBy: { select: { id: true, fullName: true, email: true } },
        notes: {
          include: { user: { select: { id: true, fullName: true } } },
          orderBy: { createdAt: 'desc' },
        },
        checklist: { orderBy: { createdAt: 'asc' } },
        aiSuggestion: true,
        histories: {
          include: { user: { select: { id: true, fullName: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!caseObj) throw new NotFoundException('Case not found');

    return {
      ...caseObj,
      documents:
        typeof caseObj.documents === 'string'
          ? JSON.parse(caseObj.documents)
          : caseObj.documents || [],
    };
  }

  async findOne(id: string) {
    const caseObj = await this.findOneInternal(id);
    return this.sanitizeCaseResponse(caseObj);
  }

  async update(id: string, updateCaseDto: UpdateCaseDto, user: any) {
    const caseObj = await this.findOneInternal(id);
    this.checkStaffAccess(caseObj, user);

    const { documents, deadline, receivedDate, assignedToId, ...rest } =
      updateCaseDto;

    const updateData: any = { ...rest };
    if (documents) updateData.documents = documents; // Pass array directly to Postgres Json field
    if (deadline) updateData.deadline = new Date(deadline);
    if (receivedDate) updateData.receivedDate = new Date(receivedDate);

    // Only Admin/Manager can change assign
    if (
      assignedToId !== undefined &&
      (user.role === Role.ADMIN || user.role === Role.MANAGER)
    ) {
      updateData.assignedToId = assignedToId;
    }

    const changedFields = Object.keys(updateData);

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.legalCase.update({
        where: { id },
        data: updateData,
      });

      if (changedFields.length > 0) {
        await tx.caseHistory.create({
          data: {
            caseId: id,
            userId: user.id,
            action: CaseHistoryAction.UPDATE_CASE,
            details: { updatedFields: changedFields },
          },
        });
      }

      return this.sanitizeCaseResponse(updated);
    });
  }

  async softDelete(id: string, user: any) {
    // Only Admin/Manager handled by RolesGuard in Controller
    const caseObj = await this.prisma.legalCase.findUnique({ where: { id } });
    if (!caseObj || caseObj.deletedAt)
      throw new NotFoundException('Case not found');

    await this.prisma.$transaction(async (tx) => {
      await tx.legalCase.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          deletedById: user.id,
        },
      });
      await tx.caseHistory.create({
        data: {
          caseId: id,
          userId: user.id,
          action: CaseHistoryAction.SOFT_DELETE_CASE,
          details: { message: 'Case soft deleted' },
        },
      });
    });

    return { success: true };
  }

  async addNote(id: string, dto: AddCaseNoteDto, user: any) {
    const caseObj = await this.findOneInternal(id);
    this.checkStaffAccess(caseObj, user);

    return this.prisma.$transaction(async (tx) => {
      const note = await tx.caseNote.create({
        data: {
          caseId: id,
          userId: user.id,
          content: dto.content,
        },
      });

      await tx.caseHistory.create({
        data: {
          caseId: id,
          userId: user.id,
          action: CaseHistoryAction.ADD_NOTE,
          details: { noteId: note.id },
        },
      });

      return note;
    });
  }

  async updateChecklistItem(
    id: string,
    itemId: string,
    dto: UpdateChecklistItemDto,
    user: any,
  ) {
    const caseObj = await this.findOneInternal(id);
    this.checkStaffAccess(caseObj, user);

    const item = await this.prisma.caseChecklistItem.findUnique({
      where: { id: itemId },
    });
    if (!item || item.caseId !== id)
      throw new NotFoundException('Checklist item not found');

    return this.prisma.$transaction(async (tx) => {
      const updatedItem = await tx.caseChecklistItem.update({
        where: { id: itemId },
        data: {
          isCompleted: dto.isCompleted,
          completedAt: dto.isCompleted ? new Date() : null,
          completedById: dto.isCompleted ? user.id : null,
        },
      });

      await tx.caseHistory.create({
        data: {
          caseId: id,
          userId: user.id,
          action: CaseHistoryAction.UPDATE_CHECKLIST,
          details: { itemId, isCompleted: dto.isCompleted },
        },
      });

      return updatedItem;
    });
  }

  async changeStatus(id: string, dto: ChangeCaseStatusDto, user: any) {
    const caseObj = await this.findOneInternal(id);
    this.checkStaffAccess(caseObj, user);

    if (caseObj.status === dto.status) return caseObj;

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.legalCase.update({
        where: { id },
        data: { status: dto.status },
      });

      await tx.caseHistory.create({
        data: {
          caseId: id,
          userId: user.id,
          action: CaseHistoryAction.CHANGE_STATUS,
          details: { oldStatus: caseObj.status, newStatus: dto.status },
        },
      });

      return this.sanitizeCaseResponse(updated);
    });
  }

  async getStats() {
    const where: Prisma.LegalCaseWhereInput = { deletedAt: null };

    const allCases = await this.prisma.legalCase.findMany({
      where,
      select: {
        status: true,
        type: true,
        field: true,
        neighborhood: true,
        deadline: true,
      },
    });

    const stats = {
      total: allCases.length,
      byStatus: {} as Record<string, number>,
      byType: {} as Record<string, number>,
      byField: {} as Record<string, number>,
      byNeighborhood: {} as Record<string, number>,
      overdue: 0,
      needsMoreInfo: 0,
    };

    const now = new Date();

    for (const c of allCases) {
      stats.byStatus[c.status] = (stats.byStatus[c.status] || 0) + 1;
      stats.byType[c.type] = (stats.byType[c.type] || 0) + 1;
      stats.byField[c.field] = (stats.byField[c.field] || 0) + 1;
      stats.byNeighborhood[c.neighborhood] =
        (stats.byNeighborhood[c.neighborhood] || 0) + 1;

      if (c.status === CaseStatus.NEEDS_MORE_INFO) stats.needsMoreInfo++;
      if (
        c.deadline &&
        new Date(c.deadline) < now &&
        c.status !== CaseStatus.CLOSED &&
        c.status !== CaseStatus.RESPONDED
      ) {
        stats.overdue++;
      }
    }

    return stats;
  }

  async uploadDocument(id: string, file: Express.Multer.File, user: any) {
    if (!file) throw new BadRequestException('No file provided');

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024)
      throw new BadRequestException('File too large (max 5MB)');

    // Validate extension and MIME
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/png',
      'image/jpeg',
    ];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }

    // Basic magic bytes check for PDF and images
    const signature = file.buffer.toString('hex', 0, 4).toUpperCase();
    if (file.mimetype === 'application/pdf' && signature !== '25504446') {
      throw new BadRequestException('Invalid PDF signature');
    }
    if (file.mimetype === 'image/jpeg' && !signature.startsWith('FFD8')) {
      throw new BadRequestException('Invalid JPEG signature');
    }
    if (file.mimetype === 'image/png' && signature !== '89504E47') {
      throw new BadRequestException('Invalid PNG signature');
    }

    const caseObj = await this.findOne(id);
    this.checkStaffAccess(caseObj, user);

    const documents = Array.isArray(caseObj.documents) ? caseObj.documents : [];
    if (documents.length >= 10) {
      throw new BadRequestException('Maximum 10 files per case allowed');
    }

    const docId = uuidv4();
    // sanitize original name: replace non-alphanumeric (keep dots and dashes) with underscore
    const safeFilename = file.originalname.replace(/[^a-zA-Z0-9.\-]/g, '_');
    const minioKey = `cases/${id}/${docId}-${safeFilename}`;

    await this.storageService.uploadFile(minioKey, file);

    const newDoc = {
      id: docId,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      uploadedBy: user.email,
      minioKey: minioKey,
    };

    const updatedDocuments = [...documents, newDoc];

    await this.prisma.legalCase.update({
      where: { id },
      data: { documents: updatedDocuments },
    });

    await this.prisma.caseHistory.create({
      data: {
        caseId: id,
        userId: user.id,
        action: CaseHistoryAction.UPDATE_CASE,
        details: {
          message: 'Uploaded document',
          documentName: file.originalname,
        },
      },
    });

    const { minioKey: _, ...safeDoc } = newDoc;
    return safeDoc;
  }

  async downloadDocument(id: string, docId: string, user: any) {
    const caseObj = await this.findOneInternal(id); // findOneInternal checks deletedAt: null

    // check view right
    if (user.role === Role.STAFF) {
      if (caseObj.assignedToId !== user.id && caseObj.createdById !== user.id) {
        throw new ForbiddenException(
          'STAFF can only view their own or assigned cases',
        );
      }
    }

    const documents = Array.isArray(caseObj.documents) ? caseObj.documents : [];
    const doc = documents.find((d: any) => d.id === docId);

    if (!doc || !doc.minioKey) {
      throw new NotFoundException('Document not found or missing minioKey');
    }

    const presignedUrl = await this.storageService.getPresignedUrl(
      doc.minioKey,
    );
    return { url: presignedUrl };
  }

  async exportDocx(id: string, noteId: string, user: any) {
    const caseObj = await this.findOneInternal(id);
    this.checkStaffAccess(caseObj, user);

    const note = (caseObj.notes || []).find((n: any) => n.id === noteId);
    if (!note || !note.content || !note.content.startsWith('[AI Dự thảo -')) {
      throw new BadRequestException('Case note is not a valid AI draft');
    }

    const config = getAgencyConfig();
    const { templateGroup, draftTitle, draftBody } = identifyTemplateGroup(note.content);
    const doc = buildDocxDocument(templateGroup, draftTitle, draftBody, config);

    const buffer = await Packer.toBuffer(doc);

    const auditPayload = {
      action: 'EXPORT_DOCX',
      caseId: id,
      noteId,
      fileType: 'docx',
      templateGroup,
      agencyConfigApplied: config.isConfigured,
      missingConfigs: config.missingFields,
    };

    await this.prisma.aiAuditLog.create({
      data: {
        userId: user.id,
        caseId: id,
        actionType: AiActionType.DRAFT,
        modelName: 'System-Docx-Exporter',
        promptTokens: 0,
        completionTokens: 0,
        latencyMs: 0,
        inputPayload: auditPayload,
        outputPayload: auditPayload,
        status: AiLogStatus.SUCCESS,
        userFeedback: AiFeedbackStatus.ACCEPTED,
      },
    });

    const filename = `Ban_Nhap_AI_${caseObj.caseCode || id}.docx`;
    return { buffer, filename };
  }

  async getDraftPreviewData(id: string, noteId: string, user: any) {
    const caseObj = await this.findOneInternal(id);
    this.checkStaffAccess(caseObj, user);

    const note = (caseObj.notes || []).find((n: any) => n.id === noteId);
    if (!note || !note.content || !note.content.startsWith('[AI Dự thảo -')) {
      throw new BadRequestException('Case note is not a valid AI draft');
    }

    const config = getAgencyConfig();
    const { templateGroup, draftTitle, draftBody } = identifyTemplateGroup(note.content);
    const cleanedLines = cleanDraftBodyLines(draftTitle, draftBody);

    const auditPayload = {
      action: 'EXPORT_PDF_PREVIEW',
      caseId: id,
      noteId,
      fileType: 'pdf_preview',
      templateGroup,
      agencyConfigApplied: config.isConfigured,
      missingConfigs: config.missingFields,
    };

    await this.prisma.aiAuditLog.create({
      data: {
        userId: user.id,
        caseId: id,
        actionType: AiActionType.DRAFT,
        modelName: 'System-Pdf-Preview-Exporter',
        promptTokens: 0,
        completionTokens: 0,
        latencyMs: 0,
        inputPayload: auditPayload,
        outputPayload: auditPayload,
        status: AiLogStatus.SUCCESS,
        userFeedback: AiFeedbackStatus.ACCEPTED,
      },
    });

    return {
      caseCode: caseObj.caseCode || id,
      templateGroup,
      draftTitle,
      cleanedLines,
      agencyConfig: config,
      warningBanner: AI_REVIEW_WARNING,
      warningDisclaimer: 'Cán bộ phải kiểm tra, chỉnh sửa và chịu trách nhiệm trước khi sử dụng hoặc ban hành.',
    };
  }
}

