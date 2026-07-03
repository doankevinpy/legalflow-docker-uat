import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProcedureCaseDto } from './dto/create-procedure-case.dto';
import { UpdateProcedureCaseDto } from './dto/update-procedure-case.dto';
import { AddProcedureNoteDto } from './dto/add-procedure-note.dto';
import { AddProcedureChecklistDto } from './dto/add-procedure-checklist.dto';
import { UpdateProcedureChecklistDto } from './dto/update-procedure-checklist.dto';
import { ProcedureField, ProcedureStatus } from '@prisma/client';

@Injectable()
export class AdministrativeProceduresService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllTypes() {
    return this.prisma.procedureType.findMany({
      where: { isActive: true },
      orderBy: { code: 'asc' },
    });
  }

  async createCase(createDto: CreateProcedureCaseDto, userId: string) {
    const procedureType = await this.prisma.procedureType.findUnique({
      where: { id: createDto.procedureTypeId },
    });
    if (!procedureType) {
      throw new NotFoundException('ProcedureType not found');
    }

    const count = await this.prisma.administrativeProcedureCase.count();
    const seq = (count + 1).toString().padStart(4, '0');
    const caseCode = `TTHC-${new Date().getFullYear()}-${seq}`;

    const newCase = await this.prisma.administrativeProcedureCase.create({
      data: {
        caseCode,
        procedureTypeId: createDto.procedureTypeId,
        field: createDto.field,
        applicantName: createDto.applicantName,
        applicantAddress: createDto.applicantAddress,
        applicantPhone: createDto.applicantPhone,
        landParcelSummary: createDto.landParcelSummary ?? {},
        constructionSummary: createDto.constructionSummary ?? {},
        dueDate: createDto.dueDate ? new Date(createDto.dueDate) : undefined,
        notes: createDto.notes,
        createdById: userId,
      },
    });

    await this.prisma.procedureAuditLog.create({
      data: {
        procedureCaseId: newCase.id,
        userId,
        actionType: 'CREATE_PROCEDURE_CASE',
        entityType: 'AdministrativeProcedureCase',
        entityId: newCase.id,
        inputPayload: createDto as any,
        outputPayload: { caseCode: newCase.caseCode },
      },
    });

    return newCase;
  }

  async findAllCases(params: {
    field?: ProcedureField;
    procedureTypeId?: string;
    status?: ProcedureStatus;
    keyword?: string;
    page?: number;
    limit?: number;
  }) {
    const page = params.page && params.page > 0 ? Number(params.page) : 1;
    const limit = params.limit && params.limit > 0 ? Number(params.limit) : 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.field) where.field = params.field;
    if (params.procedureTypeId) where.procedureTypeId = params.procedureTypeId;
    if (params.status) where.status = params.status;
    if (params.keyword) {
      where.OR = [
        { caseCode: { contains: params.keyword, mode: 'insensitive' } },
        { applicantName: { contains: params.keyword, mode: 'insensitive' } },
        { applicantPhone: { contains: params.keyword, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.administrativeProcedureCase.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          procedureType: true,
          assignedTo: { select: { id: true, fullName: true, email: true } },
          createdBy: { select: { id: true, fullName: true, email: true } },
        },
      }),
      this.prisma.administrativeProcedureCase.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findCaseById(id: string) {
    const item = await this.prisma.administrativeProcedureCase.findUnique({
      where: { id },
      include: {
        procedureType: true,
        assignedTo: { select: { id: true, fullName: true, email: true } },
        createdBy: { select: { id: true, fullName: true, email: true } },
        documents: { orderBy: { createdAt: 'desc' } },
        checklistItems: {
          orderBy: [{ isCompleted: 'asc' }, { createdAt: 'asc' }],
          include: {
            completedBy: { select: { id: true, fullName: true } },
          },
        },
        procedureNotes: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { id: true, fullName: true, role: true } },
          },
        },
        auditLogs: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { id: true, fullName: true } },
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException('ProcedureCase not found');
    }

    return item;
  }

  async updateCase(id: string, updateDto: UpdateProcedureCaseDto, userId: string) {
    const existing = await this.prisma.administrativeProcedureCase.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('ProcedureCase not found');
    }

    const updated = await this.prisma.administrativeProcedureCase.update({
      where: { id },
      data: {
        status: updateDto.status,
        field: updateDto.field,
        applicantName: updateDto.applicantName,
        applicantAddress: updateDto.applicantAddress,
        applicantPhone: updateDto.applicantPhone,
        landParcelSummary: updateDto.landParcelSummary,
        constructionSummary: updateDto.constructionSummary,
        dueDate: updateDto.dueDate ? new Date(updateDto.dueDate) : undefined,
        assignedToId: updateDto.assignedToId,
        notes: updateDto.notes,
      },
    });

    await this.prisma.procedureAuditLog.create({
      data: {
        procedureCaseId: id,
        userId,
        actionType: 'UPDATE_PROCEDURE_CASE',
        entityType: 'AdministrativeProcedureCase',
        entityId: id,
        inputPayload: updateDto as any,
        outputPayload: updated as any,
      },
    });

    return updated;
  }

  async addNote(caseId: string, dto: AddProcedureNoteDto, userId: string) {
    const existing = await this.prisma.administrativeProcedureCase.findUnique({
      where: { id: caseId },
    });
    if (!existing) {
      throw new NotFoundException('ProcedureCase not found');
    }

    return this.prisma.procedureNote.create({
      data: {
        procedureCaseId: caseId,
        userId,
        content: dto.content,
        noteType: dto.noteType,
      },
      include: {
        user: { select: { id: true, fullName: true, role: true } },
      },
    });
  }

  async addChecklist(caseId: string, dto: AddProcedureChecklistDto) {
    const existing = await this.prisma.administrativeProcedureCase.findUnique({
      where: { id: caseId },
    });
    if (!existing) {
      throw new NotFoundException('ProcedureCase not found');
    }

    return this.prisma.procedureChecklistItem.create({
      data: {
        procedureCaseId: caseId,
        checklistGroup: dto.checklistGroup,
        title: dto.title,
        description: dto.description,
        priority: dto.priority,
      },
    });
  }

  async updateChecklist(
    caseId: string,
    itemId: string,
    dto: UpdateProcedureChecklistDto,
    userId: string,
  ) {
    const existing = await this.prisma.procedureChecklistItem.findUnique({
      where: { id: itemId },
    });
    if (!existing || existing.procedureCaseId !== caseId) {
      throw new NotFoundException('ChecklistItem not found');
    }

    const data: any = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.isCompleted !== undefined) {
      data.isCompleted = dto.isCompleted;
      data.completedById = dto.isCompleted ? userId : null;
      data.completedAt = dto.isCompleted ? new Date() : null;
    }

    return this.prisma.procedureChecklistItem.update({
      where: { id: itemId },
      data,
      include: {
        completedBy: { select: { id: true, fullName: true } },
      },
    });
  }
}
