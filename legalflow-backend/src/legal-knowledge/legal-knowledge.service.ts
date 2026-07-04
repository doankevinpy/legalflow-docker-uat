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
        procedureAiAnalysis: {
          include: {
            procedureCase: {
              select: { id: true, caseCode: true, applicantName: true },
            },
          },
        },
        procedureTypeVersion: true,
        promptVersion: true,
        checklistVersion: true,
      },
    });
  }

  async resolveActiveLegalContext(
    procedureTypeId: string,
    procedureCode: string | null,
    procedureGroup: string | null,
    analysisType: string,
  ) {
    const procedureTypeVersion = await this.prisma.procedureTypeVersion.findFirst({
      where: {
        OR: [
          { procedureTypeId },
          ...(procedureCode ? [{ procedureCode }] : []),
        ],
        status: 'ACTIVE',
      },
      orderBy: { version: 'desc' },
    });

    const promptVersion = await this.prisma.aiPromptVersion.findFirst({
      where: {
        analysisType,
        status: 'ACTIVE',
      },
      orderBy: { version: 'desc' },
    });

    const checklistVersion = await this.prisma.checklistVersion.findFirst({
      where: {
        OR: [
          ...(procedureCode ? [{ procedureTypeCode: procedureCode }] : []),
          ...(procedureGroup ? [{ procedureGroup }] : []),
        ],
        status: 'ACTIVE',
      },
      orderBy: { version: 'desc' },
    });

    const docIds = new Set<string>();
    const docCodes = new Set<string>();

    const collectDocs = (jsonVal: any) => {
      if (!jsonVal || !Array.isArray(jsonVal)) return;
      for (const item of jsonVal) {
        if (typeof item === 'string') {
          if (item.includes('/') || item.includes('-') || item.length < 15) docCodes.add(item);
          else docIds.add(item);
        } else if (typeof item === 'object' && item !== null) {
          if (item.id) docIds.add(item.id);
          if (item.code || item.documentCode) docCodes.add(item.code || item.documentCode);
        }
      }
    };

    collectDocs(procedureTypeVersion?.legalBasisDocumentIds);
    collectDocs(promptVersion?.legalDocumentIds);
    collectDocs(checklistVersion?.legalDocumentIds);

    let legalDocuments: any[] = [];
    let source = 'MISSING_CONTEXT';

    if (docIds.size > 0 || docCodes.size > 0) {
      legalDocuments = await this.prisma.legalDocument.findMany({
        where: {
          OR: [
            ...(docIds.size > 0 ? [{ id: { in: Array.from(docIds) } }] : []),
            ...(docCodes.size > 0 ? [{ documentCode: { in: Array.from(docCodes) } }] : []),
          ],
          status: 'ACTIVE',
        },
      });
      if (legalDocuments.length > 0) {
        source = 'ACTIVE_VERSION';
      }
    }

    if (legalDocuments.length === 0) {
      const fallbackTypes = ['LAW', 'DECREE', 'CIRCULAR', 'DECISION'];
      legalDocuments = await this.prisma.legalDocument.findMany({
        where: {
          documentType: { in: fallbackTypes as any },
          status: 'ACTIVE',
        },
        take: 10,
      });
      if (legalDocuments.length > 0 || procedureTypeVersion || promptVersion || checklistVersion) {
        source = 'FALLBACK_ACTIVE_DOCUMENTS';
      }
    }

    if (!procedureTypeVersion && !promptVersion && !checklistVersion && legalDocuments.length === 0) {
      source = 'MISSING_CONTEXT';
    }

    const knowledgeBaseVersion = promptVersion?.version ? `LAND_KB_${promptVersion.version}` : 'LAND_KB_V1_2026';

    const warning =
      source === 'MISSING_CONTEXT'
        ? 'Chưa xác định được legal knowledge version active; cán bộ phải kiểm tra căn cứ pháp lý hiện hành.'
        : 'Cán bộ phải kiểm tra văn bản hiện hành, văn bản sửa đổi/bổ sung/thay thế nếu có.';

    return {
      procedureTypeVersion,
      promptVersion,
      checklistVersion,
      legalDocuments,
      knowledgeBaseVersion,
      source,
      warning,
    };
  }

  async createLegalSnapshot(
    procedureAiAnalysisId: string,
    context: any,
    userId: string,
    caseId?: string,
  ) {
    const { procedureTypeVersion, promptVersion, checklistVersion, legalDocuments, knowledgeBaseVersion, source } = context;

    const snapshotJson = {
      procedureTypeCode: procedureTypeVersion?.procedureCode || null,
      analysisType: promptVersion?.analysisType || null,
      legalDocuments: (legalDocuments || []).map((d: any) => ({
        id: d.id,
        code: d.documentCode,
        name: d.title || d.documentName || d.documentCode,
        type: d.documentType,
      })),
      promptVersion: promptVersion
        ? { id: promptVersion.id, key: promptVersion.promptKey, version: promptVersion.version }
        : null,
      checklistVersion: checklistVersion
        ? { id: checklistVersion.id, key: checklistVersion.checklistKey, version: checklistVersion.version }
        : null,
      procedureTypeVersion: procedureTypeVersion
        ? { id: procedureTypeVersion.id, version: procedureTypeVersion.version, code: procedureTypeVersion.procedureCode }
        : null,
      warnings: [
        'Căn cứ pháp lý hiển thị là phiên bản dữ liệu hệ thống ghi nhận tại thời điểm AI rà soát; cán bộ phải kiểm tra văn bản pháp luật hiện hành, văn bản sửa đổi/bổ sung/thay thế nếu có.',
        source === 'MISSING_CONTEXT' ? 'Chưa xác định được legal knowledge version active; cán bộ phải kiểm tra căn cứ pháp lý hiện hành.' : null,
      ].filter(Boolean),
      createdAt: new Date().toISOString(),
      source,
    };

    const snapshot = await this.prisma.procedureAiAnalysisLegalSnapshot.create({
      data: {
        procedureAiAnalysisId,
        legalDocumentIds: (legalDocuments || []).map((d: any) => d.documentCode || d.id),
        promptVersionId: promptVersion?.id || null,
        checklistVersionId: checklistVersion?.id || null,
        procedureTypeVersionId: procedureTypeVersion?.id || null,
        knowledgeBaseVersion,
        snapshotJson,
      },
    });

    if (caseId && userId) {
      try {
        await this.prisma.procedureAuditLog.create({
          data: {
            procedureCaseId: caseId,
            userId,
            actionType: 'AI_LEGAL_SNAPSHOT_CREATED',
            entityType: 'ProcedureAiAnalysisLegalSnapshot',
            entityId: snapshot.id,
            inputPayload: { procedureAiAnalysisId, source },
            outputPayload: { snapshotId: snapshot.id, knowledgeBaseVersion },
          },
        });
      } catch (err: any) {
        console.error('Failed to create audit log for legal snapshot:', err?.message || err);
      }
    }

    return snapshot;
  }
}
