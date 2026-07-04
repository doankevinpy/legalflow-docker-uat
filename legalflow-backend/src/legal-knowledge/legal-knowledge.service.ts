import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LegalKnowledgeService {
  constructor(private readonly prisma: PrismaService) {}

  async getDocuments() {
    return this.prisma.legalDocument.findMany({
      orderBy: { issuedDate: 'desc' },
      include: {
        outgoingRelations: {
          include: { relatedDocument: true },
        },
        incomingRelations: {
          include: { document: true },
        },
      },
    });
  }

  async getDocument(id: string) {
    const doc = await this.prisma.legalDocument.findUnique({
      where: { id },
      include: {
        outgoingRelations: {
          include: { relatedDocument: true },
        },
        incomingRelations: {
          include: { document: true },
        },
      },
    });
    if (!doc) {
      throw new NotFoundException(`LegalDocument with ID "${id}" not found`);
    }
    return doc;
  }

  async getProcedureTypeVersions() {
    return this.prisma.procedureTypeVersion.findMany({
      orderBy: [{ procedureCode: 'asc' }, { version: 'desc' }],
    });
  }

  async getPromptVersions() {
    return this.prisma.aiPromptVersion.findMany({
      orderBy: [{ promptKey: 'asc' }, { version: 'desc' }],
    });
  }

  async getChecklistVersions() {
    return this.prisma.checklistVersion.findMany({
      orderBy: [{ checklistKey: 'asc' }, { version: 'desc' }],
    });
  }

  async getUpdateLogs() {
    return this.prisma.legalUpdateLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        sourceDocument: true,
      },
    });
  }

  async getSnapshots() {
    return this.prisma.procedureAiAnalysisLegalSnapshot.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        procedureAiAnalysis: true,
        procedureTypeVersion: true,
        promptVersion: true,
        checklistVersion: true,
      },
    });
  }
}
