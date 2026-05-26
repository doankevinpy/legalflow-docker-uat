import { Injectable, NotFoundException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { QueryCasesDto } from './dto/query-cases.dto';
import { AddCaseNoteDto } from './dto/add-case-note.dto';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';
import { ChangeCaseStatusDto } from './dto/change-case-status.dto';
import { CaseHistoryAction, CaseField, CaseStatus } from './enums/case.enum';
import { Role } from '../common/role.enum';
import { Prisma } from '@prisma/client';

@Injectable()
export class CasesService {
  constructor(private prisma: PrismaService) {}

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
        throw new ForbiddenException('STAFF can only modify their own or assigned cases');
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
          const seqYear = receivedDate ? new Date(receivedDate).getFullYear() : new Date().getFullYear();
          
          let seq = await tx.caseSequence.findUnique({ where: { year: seqYear } });
          if (!seq) {
            seq = await tx.caseSequence.create({ data: { year: seqYear, lastSequence: 1 } });
          } else {
            seq = await tx.caseSequence.update({
              where: { year: seqYear },
              data: { lastSequence: { increment: 1 } }
            });
          }

          const seqStr = seq.lastSequence.toString().padStart(3, '0');
          const code = `${seqYear}-${rest.type}-${seqStr}-${rest.neighborhood}`;

          const newCase = await tx.legalCase.create({
            data: {
              ...rest,
              caseCode: code,
              documents: documents ? JSON.stringify(documents) : '[]',
              receivedDate: receivedDate ? new Date(receivedDate) : undefined,
              deadline: rest.deadline ? new Date(rest.deadline) : undefined,
              assignedToId: finalAssignedToId,
              createdById: user.id,
              checklist: {
                create: this.getDefaultChecklist(rest.field)
              },
              histories: {
                create: {
                  userId: user.id,
                  action: CaseHistoryAction.CREATE_CASE,
                  details: JSON.stringify({ message: 'Case created' })
                }
              }
            }
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
      throw new InternalServerErrorException('Cannot generate unique case code');
    }

    return this.findOne(createdCase.id);
  }

  async findAll(query: QueryCasesDto) {
    const { search, status, type, field, neighborhood, assignedToId, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = query;
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
        { caseCode: { contains: search } },
        { senderName: { contains: search } },
        { summary: { contains: search } },
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
          createdBy: { select: { id: true, fullName: true, email: true } }
        }
      })
    ]);

    // parse documents JSON string back to object array if it's a string (SQLite fallback), otherwise use directly
    const mappedData = data.map(c => ({
      ...c,
      documents: typeof c.documents === 'string' ? JSON.parse(c.documents) : (c.documents || [])
    }));

    return {
      data: mappedData,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findOne(id: string) {
    const caseObj = await this.prisma.legalCase.findFirst({
      where: { id, deletedAt: null },
      include: {
        assignedTo: { select: { id: true, fullName: true, email: true } },
        createdBy: { select: { id: true, fullName: true, email: true } },
        notes: {
          include: { user: { select: { id: true, fullName: true } } },
          orderBy: { createdAt: 'desc' }
        },
        checklist: { orderBy: { createdAt: 'asc' } },
        histories: {
          include: { user: { select: { id: true, fullName: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!caseObj) throw new NotFoundException('Case not found');

    return {
      ...caseObj,
      documents: typeof caseObj.documents === 'string' ? JSON.parse(caseObj.documents) : (caseObj.documents || [])
    };
  }

  async update(id: string, updateCaseDto: UpdateCaseDto, user: any) {
    const caseObj = await this.findOne(id);
    this.checkStaffAccess(caseObj, user);

    const { documents, deadline, receivedDate, assignedToId, ...rest } = updateCaseDto;

    const updateData: any = { ...rest };
    if (documents) updateData.documents = JSON.stringify(documents);
    if (deadline) updateData.deadline = new Date(deadline);
    if (receivedDate) updateData.receivedDate = new Date(receivedDate);

    // Only Admin/Manager can change assign
    if (assignedToId !== undefined && (user.role === Role.ADMIN || user.role === Role.MANAGER)) {
      updateData.assignedToId = assignedToId;
    }

    const changedFields = Object.keys(updateData);
    
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.legalCase.update({
        where: { id },
        data: updateData
      });

      if (changedFields.length > 0) {
        await tx.caseHistory.create({
          data: {
            caseId: id,
            userId: user.id,
            action: CaseHistoryAction.UPDATE_CASE,
            details: JSON.stringify({ updatedFields: changedFields })
          }
        });
      }

      return updated;
    });
  }

  async softDelete(id: string, user: any) {
    // Only Admin/Manager handled by RolesGuard in Controller
    const caseObj = await this.prisma.legalCase.findUnique({ where: { id } });
    if (!caseObj || caseObj.deletedAt) throw new NotFoundException('Case not found');

    await this.prisma.$transaction(async (tx) => {
      await tx.legalCase.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          deletedById: user.id
        }
      });
      await tx.caseHistory.create({
        data: {
          caseId: id,
          userId: user.id,
          action: CaseHistoryAction.SOFT_DELETE_CASE,
          details: JSON.stringify({ message: 'Case soft deleted' })
        }
      });
    });
    
    return { success: true };
  }

  async addNote(id: string, dto: AddCaseNoteDto, user: any) {
    const caseObj = await this.findOne(id);
    this.checkStaffAccess(caseObj, user);

    return this.prisma.$transaction(async (tx) => {
      const note = await tx.caseNote.create({
        data: {
          caseId: id,
          userId: user.id,
          content: dto.content
        }
      });

      await tx.caseHistory.create({
        data: {
          caseId: id,
          userId: user.id,
          action: CaseHistoryAction.ADD_NOTE,
          details: JSON.stringify({ noteId: note.id })
        }
      });

      return note;
    });
  }

  async updateChecklistItem(id: string, itemId: string, dto: UpdateChecklistItemDto, user: any) {
    const caseObj = await this.findOne(id);
    this.checkStaffAccess(caseObj, user);

    const item = await this.prisma.caseChecklistItem.findUnique({ where: { id: itemId } });
    if (!item || item.caseId !== id) throw new NotFoundException('Checklist item not found');

    return this.prisma.$transaction(async (tx) => {
      const updatedItem = await tx.caseChecklistItem.update({
        where: { id: itemId },
        data: {
          isCompleted: dto.isCompleted,
          completedAt: dto.isCompleted ? new Date() : null,
          completedById: dto.isCompleted ? user.id : null
        }
      });

      await tx.caseHistory.create({
        data: {
          caseId: id,
          userId: user.id,
          action: CaseHistoryAction.UPDATE_CHECKLIST,
          details: JSON.stringify({ itemId, isCompleted: dto.isCompleted })
        }
      });

      return updatedItem;
    });
  }

  async changeStatus(id: string, dto: ChangeCaseStatusDto, user: any) {
    const caseObj = await this.findOne(id);
    this.checkStaffAccess(caseObj, user);

    if (caseObj.status === dto.status) return caseObj;

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.legalCase.update({
        where: { id },
        data: { status: dto.status }
      });

      await tx.caseHistory.create({
        data: {
          caseId: id,
          userId: user.id,
          action: CaseHistoryAction.CHANGE_STATUS,
          details: JSON.stringify({ oldStatus: caseObj.status, newStatus: dto.status })
        }
      });

      return updated;
    });
  }

  async getStats() {
    const where: Prisma.LegalCaseWhereInput = { deletedAt: null };
    
    const allCases = await this.prisma.legalCase.findMany({ where, select: { status: true, type: true, field: true, neighborhood: true, deadline: true } });

    const stats = {
      total: allCases.length,
      byStatus: {} as Record<string, number>,
      byType: {} as Record<string, number>,
      byField: {} as Record<string, number>,
      byNeighborhood: {} as Record<string, number>,
      overdue: 0,
      needsMoreInfo: 0
    };

    const now = new Date();

    for (const c of allCases) {
      stats.byStatus[c.status] = (stats.byStatus[c.status] || 0) + 1;
      stats.byType[c.type] = (stats.byType[c.type] || 0) + 1;
      stats.byField[c.field] = (stats.byField[c.field] || 0) + 1;
      stats.byNeighborhood[c.neighborhood] = (stats.byNeighborhood[c.neighborhood] || 0) + 1;

      if (c.status === CaseStatus.NEEDS_MORE_INFO) stats.needsMoreInfo++;
      if (c.deadline && new Date(c.deadline) < now && c.status !== CaseStatus.CLOSED && c.status !== CaseStatus.RESPONDED) {
        stats.overdue++;
      }
    }

    return stats;
  }
}
