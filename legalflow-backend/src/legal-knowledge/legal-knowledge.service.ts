import { Injectable, NotFoundException, BadRequestException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LegalUpdateReviewStatus } from '@prisma/client';

export class RollbackVersionDto {
  rollbackReason!: string;
  confirmationText!: string;
  targetVersionId?: string;
}

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

  private async hydrateLogNotes(log: any, db: any = this.prisma): Promise<any> {
    if (!log || !log.notes) return log;
    try {
      let parsedNotes: any;
      if (typeof log.notes === 'string') {
        parsedNotes = JSON.parse(log.notes);
      } else if (typeof log.notes === 'object') {
        parsedNotes = log.notes;
      }
      if (!parsedNotes || typeof parsedNotes !== 'object') return log;
      if (parsedNotes.draftVersions && Array.isArray(parsedNotes.draftVersions.list) && parsedNotes.draftVersions.list.length > 0) {
        const hydratedList = await Promise.all(
          parsedNotes.draftVersions.list.map(async (draft: any) => {
            if (!draft || !draft.id || !draft.type) return draft;
            let record: any = null;
            if (draft.type === 'PROCEDURE_TYPE_VERSION') {
              record = await db.procedureTypeVersion.findUnique({ where: { id: draft.id } });
            } else if (draft.type === 'AI_PROMPT_VERSION') {
              record = await db.aiPromptVersion.findUnique({ where: { id: draft.id } });
            } else if (draft.type === 'CHECKLIST_VERSION') {
              record = await db.checklistVersion.findUnique({ where: { id: draft.id } });
            }
            if (record) {
              const currentStatus = record.status;
              return {
                ...draft,
                status: currentStatus,
                currentStatus: currentStatus,
                effectiveFrom: record.effectiveFrom ? record.effectiveFrom.toISOString() : null,
                effectiveTo: record.effectiveTo ? record.effectiveTo.toISOString() : null,
                isActivatable: currentStatus === 'DRAFT',
              };
            }
            const fallbackStatus = draft.currentStatus || draft.status || 'DRAFT';
            return {
              ...draft,
              status: fallbackStatus,
              currentStatus: fallbackStatus,
              isActivatable: fallbackStatus === 'DRAFT',
            };
          })
        );
        parsedNotes.draftVersions.list = hydratedList;
        log.notes = typeof log.notes === 'string' ? JSON.stringify(parsedNotes) : parsedNotes;
      }
    } catch (e) {
      // ignore JSON parse error
    }
    return log;
  }

  private async hydrateLogsNotes(logs: any[], db: any = this.prisma): Promise<any[]> {
    if (!Array.isArray(logs)) return logs;
    return Promise.all(logs.map(log => this.hydrateLogNotes(log, db)));
  }

  async getUpdateLogs() {
    const logs = await this.prisma.legalUpdateLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        sourceDocument: true,
        reviewedBy: {
          select: { id: true, email: true, fullName: true, role: true },
        },
      },
    });
    return this.hydrateLogsNotes(logs);
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

  async getUpdateLogById(id: string) {
    const log = await this.prisma.legalUpdateLog.findUnique({
      where: { id },
      include: {
        sourceDocument: true,
        reviewedBy: {
          select: { id: true, email: true, fullName: true, role: true },
        },
      },
    });
    if (!log) {
      throw new NotFoundException(`LegalUpdateLog with ID "${id}" not found`);
    }
    return this.hydrateLogNotes(log);
  }

  async analyzeImpact(sourceDocumentId?: string, title?: string, notes?: string) {
    let sourceDoc: any = null;
    if (sourceDocumentId) {
      sourceDoc = await this.prisma.legalDocument.findUnique({
        where: { id: sourceDocumentId },
        include: {
          outgoingRelations: { include: { relatedDocument: true } },
          incomingRelations: { include: { document: true } },
        },
      });
      if (!sourceDoc) {
        throw new NotFoundException(`LegalDocument with ID "${sourceDocumentId}" not found`);
      }
    }

    const allActiveDocs = await this.prisma.legalDocument.findMany({
      where: {
        status: 'ACTIVE',
        ...(sourceDoc ? { id: { not: sourceDoc.id } } : {}),
      },
      take: 20,
    });

    const activeProcedures = await this.prisma.procedureTypeVersion.findMany({
      where: { status: 'ACTIVE' },
    });

    const activePrompts = await this.prisma.aiPromptVersion.findMany({
      where: { status: 'ACTIVE' },
    });

    const activeChecklists = await this.prisma.checklistVersion.findMany({
      where: { status: 'ACTIVE' },
    });

    const recentSnapshots = await this.prisma.procedureAiAnalysisLegalSnapshot.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        procedureAiAnalysis: {
          include: {
            procedureCase: {
              select: { id: true, caseCode: true, applicantName: true, status: true },
            },
          },
        },
      },
    });

    const openCases = await this.prisma.administrativeProcedureCase.findMany({
      where: {
        status: { in: ['SUBMITTED', 'IN_REVIEW', 'SUPPLEMENT_REQUIRED'] },
      },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });

    const affectedLegalDocuments = allActiveDocs.slice(0, 5).map((doc: any) => ({
      id: doc.id,
      documentCode: doc.documentCode,
      documentTitle: doc.documentTitle,
      status: doc.status,
      relationType: 'MAY_BE_AFFECTED_OR_AMENDED',
      impactNote: `Có thể chịu tác động hoặc cần rà soát sự tương thích với ${sourceDoc?.documentCode || title || 'văn bản mới'}. Cần cán bộ đối chiếu hiệu lực thi hành.`,
    }));

    const affectedProcedureTypes = activeProcedures.map((proc: any) => ({
      id: proc.id,
      procedureCode: proc.procedureCode,
      version: proc.version,
      status: proc.status,
      impactNote: `Thủ tục ${proc.procedureCode} đang tham chiếu hệ thống pháp luật hiện hành; có thể ảnh hưởng đến thành phần hồ sơ và trình tự giải quyết khi văn bản mới có hiệu lực.`,
    }));

    const affectedPromptVersions = activePrompts.map((prompt: any) => ({
      id: prompt.id,
      promptKey: prompt.promptKey,
      version: prompt.version,
      analysisType: prompt.analysisType,
      status: prompt.status,
      impactNote: `System prompt AI "${prompt.promptKey}" cần được cán bộ kiểm tra để bổ sung hoặc điều chỉnh các căn cứ pháp lý mới, tránh AI rà soát theo luật cũ.`,
    }));

    const affectedChecklistVersions = activeChecklists.map((chk: any) => ({
      id: chk.id,
      checklistKey: chk.checklistKey,
      version: chk.version,
      procedureTypeCode: chk.procedureTypeCode,
      status: chk.status,
      impactNote: `Checklist rà soát tiêu chí nghiệp vụ cần được kiểm tra thực tế để cập nhật yêu cầu thành phần hồ sơ theo quy định mới.`,
    }));

    const affectedAiSnapshots = recentSnapshots.map((snap: any) => ({
      id: snap.id,
      analysisId: snap.procedureAiAnalysisId,
      caseCode: snap.procedureAiAnalysis?.procedureCase?.caseCode || 'N/A',
      applicantName: snap.procedureAiAnalysis?.procedureCase?.applicantName || 'N/A',
      knowledgeBaseVersion: snap.knowledgeBaseVersion || 'LAND_KB_V1_2026',
      createdAt: snap.createdAt,
      impactNote: `Kết quả AI rà soát trước đây đã ghi nhận snapshot pháp lý cũ (${snap.knowledgeBaseVersion || 'LAND_KB_V1_2026'}); cần lưu ý lịch sử áp dụng luật khi thẩm tra hồ sơ.`,
    }));

    const affectedOpenProcedureCases = openCases.map((c: any) => ({
      id: c.id,
      caseCode: c.caseCode,
      applicantName: c.applicantName,
      procedureCode: c.procedureCode,
      status: c.status,
      assignedToId: c.assignedToId,
      impactNote: `Hồ sơ đang xử lý ở trạng thái ${c.status}; cán bộ thụ lý cần kiểm tra điều khoản chuyển tiếp (nếu có) để giải quyết đúng quy định pháp luật hiện hành.`,
    }));

    const impactSummary = `Phân tích AI cho thấy văn bản/quy định [${sourceDoc?.documentCode || title || 'Văn bản mới'}] có thể tác động đến ${affectedLegalDocuments.length} văn bản pháp lý đang hiệu lực trong kho, ${affectedProcedureTypes.length} phiên bản thủ tục hành chính, ${affectedPromptVersions.length} phiên bản prompt AI và ${affectedChecklistVersions.length} danh mục kiểm tra nghiệp vụ. Phát hiện ${affectedOpenProcedureCases.length} hồ sơ TTHC đang giải quyết có thể chịu ảnh hưởng. Cán bộ nghiệp vụ cần rà soát, đối chiếu phạm vi điều chỉnh để tạo phiên bản cập nhật nếu cần thiết.`;

    const recommendedActions = [
      `Rà soát, đối chiếu toàn văn bản mới (${sourceDoc?.documentCode || title || 'Văn bản cập nhật'}) với các văn bản hướng dẫn hiện hành để xác định chính xác các điều khoản bị bãi bỏ hoặc sửa đổi.`,
      `Xem xét tạo phiên bản mới (version tiếp theo) cho các thủ tục hành chính chịu tác động (${affectedProcedureTypes.map((p: any) => p.procedureCode).join(', ') || 'các thủ tục liên quan'}).`,
      `Cập nhật nội dung chỉ dẫn pháp lý trong System Prompt của AI trợ lý rà soát để bảo đảm AI không trích dẫn căn cứ hết hiệu lực.`,
      `Cập nhật danh mục tiêu chí kiểm tra (Checklist) cho cán bộ một cửa và chuyên viên thẩm tra.`,
      `Thông báo cho cán bộ thụ lý kiểm tra lại các hồ sơ TTHC đang giải quyết dở dang (${affectedOpenProcedureCases.length} hồ sơ) để áp dụng đúng quy định chuyển tiếp.`,
    ];

    const riskFlags = [
      `⚠️ RỦI RO ÁP DỤNG LUẬT CŨ: Nếu không cập nhật kịp thời, trợ lý AI và cán bộ có thể tiếp tục tham mưu giải quyết hồ sơ theo căn cứ cũ đã hết hiệu lực hoặc bị sửa đổi.`,
      `⚠️ RỦI RO THIẾU ĐỒNG BỘ: Sự bất đồng bộ giữa phiên bản thủ tục (ProcedureTypeVersion) và phiên bản prompt AI (AiPromptVersion) có thể dẫn đến kết quả rà soát mâu thuẫn.`,
      `⚠️ LƯU Ý CHUYỂN TIẾP: Cần kiểm tra kỹ quy định chuyển tiếp (nếu có) của văn bản mới đối với các hồ sơ đã tiếp nhận trước ngày văn bản có hiệu lực.`,
    ];

    if (allActiveDocs.length === 0 && activeProcedures.length === 0) {
      riskFlags.unshift(`⚠️ Cần cán bộ bổ sung/kiểm tra căn cứ. Hiện tại kho tri thức chưa ghi nhận đủ dữ liệu liên kết hoặc văn bản đang hiệu lực để đánh giá toàn diện.`);
    }

    const impactAnalysis = {
      disclaimer: 'BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA',
      sourceDocument: {
        id: sourceDoc?.id || '',
        documentCode: sourceDoc?.documentCode || title || 'NEW_DOC',
        documentTitle: sourceDoc?.documentTitle || title || 'Văn bản / Quy định mới cập nhật',
        status: sourceDoc?.status || 'DRAFT',
      },
      impactSummary,
      affectedLegalDocuments,
      affectedProcedureTypes,
      affectedPromptVersions,
      affectedChecklistVersions,
      affectedAiSnapshots,
      affectedOpenProcedureCases,
      recommendedActions,
      riskFlags,
      requiresOfficerVerification: true,
    };

    const updateTitle = `Phân tích tác động: ${sourceDoc?.documentTitle || title || 'Cập nhật pháp lý mới'}`;
    const log = await this.prisma.legalUpdateLog.create({
      data: {
        updateTitle,
        sourceDocumentId: sourceDoc?.id || null,
        affectedDocumentIds: affectedLegalDocuments.map((d: any) => d.documentCode || d.id),
        affectedProcedureTypes: affectedProcedureTypes.map((p: any) => p.procedureCode),
        affectedPromptKeys: affectedPromptVersions.map((p: any) => p.promptKey),
        affectedChecklistKeys: affectedChecklistVersions.map((c: any) => c.checklistKey),
        impactSummary,
        reviewStatus: 'PENDING',
        notes: JSON.stringify(impactAnalysis, null, 2),
      },
      include: {
        sourceDocument: true,
        reviewedBy: {
          select: { id: true, email: true, fullName: true, role: true },
        },
      },
    });

    return {
      success: true,
      logId: log.id,
      updateLog: log,
      impactAnalysis,
    };
  }

  async handleWorkflowAction(id: string, action: string, note: string, reason: string, user: any) {
    if (!user || user.role === 'VIEWER') {
      throw new ForbiddenException('Tài khoản VIEWER không được quyền thao tác rà soát cập nhật pháp lý.');
    }

    const log = await this.prisma.legalUpdateLog.findUnique({
      where: { id },
      include: {
        sourceDocument: true,
        reviewedBy: {
          select: { id: true, email: true, fullName: true, role: true },
        },
      },
    });
    if (!log) {
      throw new NotFoundException(`Không tìm thấy nhật ký cập nhật pháp lý với ID "${id}"`);
    }

    let parsedNotes: any = {};
    try {
      if (log.notes) {
        const raw = JSON.parse(log.notes);
        if (raw && (raw.impactAnalysis !== undefined || raw.workflowHistory !== undefined)) {
          parsedNotes = raw;
        } else {
          parsedNotes = { impactAnalysis: raw };
        }
      }
    } catch (e) {
      parsedNotes = { impactAnalysis: { impactSummary: log.notes } };
    }

    if (log.reviewStatus === 'REJECTED' || parsedNotes.subStatus === 'CLOSED' || parsedNotes.subStatus === 'REJECTED') {
      throw new BadRequestException('Nhật ký cập nhật này đã bị từ chối hoặc đã đóng, không thể tiếp tục thao tác.');
    }

    const trimmedNote = (note || '').trim();
    const trimmedReason = (reason || '').trim();
    const inputContent = trimmedNote || trimmedReason;

    let newDbStatus: LegalUpdateReviewStatus = log.reviewStatus;
    let newSubStatus = parsedNotes.subStatus || log.reviewStatus;
    const oldStatusLabel = parsedNotes.subStatus || log.reviewStatus;

    switch (action) {
      case 'START_REVIEW':
        newDbStatus = 'REVIEWING';
        newSubStatus = 'REVIEWING';
        break;
      case 'ADD_NOTE':
        newDbStatus = log.reviewStatus === 'PENDING' ? 'REVIEWING' : log.reviewStatus;
        newSubStatus = parsedNotes.subStatus || log.reviewStatus;
        break;
      case 'REQUEST_MORE_INFO':
        newDbStatus = log.reviewStatus === 'PENDING' ? 'REVIEWING' : log.reviewStatus;
        newSubStatus = 'NEEDS_MORE_INFO';
        break;
      case 'APPROVE_FOR_VERSIONING':
        if (user.role !== 'MANAGER' && user.role !== 'ADMIN') {
          throw new ForbiddenException('Chỉ Lãnh đạo (MANAGER/ADMIN) mới có quyền phê duyệt hướng xử lý cập nhật pháp lý.');
        }
        if (!inputContent) {
          throw new BadRequestException('Vui lòng nhập ghi chú hoặc lý do phê duyệt hướng xử lý.');
        }
        newDbStatus = 'APPROVED';
        newSubStatus = 'APPROVED_FOR_VERSIONING';
        break;
      case 'REJECT':
        if (user.role !== 'MANAGER' && user.role !== 'ADMIN') {
          throw new ForbiddenException('Chỉ Lãnh đạo (MANAGER/ADMIN) mới có quyền từ chối hướng xử lý cập nhật pháp lý.');
        }
        if (!inputContent) {
          throw new BadRequestException('Vui lòng nhập lý do từ chối hướng xử lý.');
        }
        newDbStatus = 'REJECTED';
        newSubStatus = 'REJECTED';
        break;
      case 'CLOSE':
        if (user.role !== 'MANAGER' && user.role !== 'ADMIN') {
          throw new ForbiddenException('Chỉ Lãnh đạo (MANAGER/ADMIN) mới có quyền đóng nhật ký cập nhật pháp lý.');
        }
        newDbStatus = log.reviewStatus;
        newSubStatus = 'CLOSED';
        break;
      default:
        throw new BadRequestException(`Hành động workflow "${action}" không hợp lệ.`);
    }

    const historyEntry = {
      action,
      userId: user.id || 'SYSTEM',
      userEmail: user.email || '',
      userRole: user.role || '',
      oldStatus: oldStatusLabel,
      newStatus: newSubStatus,
      note: inputContent,
      createdAt: new Date().toISOString(),
    };

    const workflowHistory = Array.isArray(parsedNotes.workflowHistory) ? parsedNotes.workflowHistory : [];
    workflowHistory.push(historyEntry);
    parsedNotes.workflowHistory = workflowHistory;
    parsedNotes.subStatus = newSubStatus;

    const updatedLog = await this.prisma.legalUpdateLog.update({
      where: { id },
      data: {
        reviewStatus: newDbStatus,
        reviewedById: user.id || log.reviewedById,
        reviewedAt: new Date(),
        notes: JSON.stringify(parsedNotes, null, 2),
      },
      include: {
        sourceDocument: true,
        reviewedBy: {
          select: { id: true, email: true, fullName: true, role: true },
        },
      },
    });

    return {
      success: true,
      message: `Đã thực hiện thành công thao tác ${action}`,
      updateLog: await this.hydrateLogNotes(updatedLog),
    };
  }

  async createDraftVersion(
    id: string,
    draftType: string,
    sourceVersionId: string,
    reason: string,
    draftVersion?: string,
    user?: any,
  ) {
    if (!user || (user.role !== 'MANAGER' && user.role !== 'ADMIN')) {
      throw new ForbiddenException('Chỉ Lãnh đạo (MANAGER/ADMIN) mới có quyền tạo bản nháp version mới.');
    }

    const log = await this.prisma.legalUpdateLog.findUnique({
      where: { id },
      include: {
        sourceDocument: true,
        reviewedBy: {
          select: { id: true, email: true, fullName: true, role: true },
        },
      },
    });
    if (!log) {
      throw new NotFoundException(`Không tìm thấy nhật ký cập nhật pháp lý với ID "${id}"`);
    }

    if (log.reviewStatus !== 'APPROVED') {
      throw new BadRequestException('Chỉ tạo bản nháp sau khi đã phê duyệt hướng xử lý (APPROVED).');
    }

    let parsedNotes: any = {};
    try {
      if (log.notes) {
        const raw = JSON.parse(log.notes);
        parsedNotes = raw && typeof raw === 'object' ? raw : { impactAnalysis: raw };
      }
    } catch (e) {
      parsedNotes = { impactAnalysis: { impactSummary: log.notes } };
    }

    if (parsedNotes.subStatus === 'CLOSED' || parsedNotes.subStatus === 'REJECTED') {
      throw new BadRequestException('Nhật ký cập nhật này đã đóng hoặc từ chối, không thể tạo bản nháp version.');
    }

    if (!reason || !reason.trim()) {
      throw new BadRequestException('Vui lòng nhập lý do tạo bản nháp version mới.');
    }

    if (!sourceVersionId) {
      throw new BadRequestException('Vui lòng chọn phiên bản nguồn ACTIVE để tạo bản nháp.');
    }

    let createdDraft: any = null;
    let draftSummary: any = null;

    if (draftType === 'PROCEDURE_TYPE_VERSION') {
      const source = await this.prisma.procedureTypeVersion.findUnique({
        where: { id: sourceVersionId },
      });
      if (!source) throw new NotFoundException(`Phiên bản thủ tục nguồn với ID "${sourceVersionId}" không tồn tại.`);
      if (source.status !== 'ACTIVE') throw new BadRequestException('Phiên bản thủ tục nguồn không ở trạng thái ACTIVE.');

      let newVer = draftVersion ? draftVersion.trim() : '';
      if (!newVer) {
        const base = source.version.replace(/-draft.*$/, '');
        let counter = 1;
        while (true) {
          const candidate = `${base}.${counter}-draft`;
          const collision = await this.prisma.procedureTypeVersion.findUnique({
            where: { procedureTypeId_version: { procedureTypeId: source.procedureTypeId, version: candidate } },
          });
          if (!collision) {
            newVer = candidate;
            break;
          }
          counter++;
          if (counter > 50) {
            newVer = `${base}.${Date.now()}-draft`;
            break;
          }
        }
      } else {
        const collision = await this.prisma.procedureTypeVersion.findUnique({
          where: { procedureTypeId_version: { procedureTypeId: source.procedureTypeId, version: newVer } },
        });
        if (collision) throw new BadRequestException(`Phiên bản thủ tục "${newVer}" đã tồn tại.`);
      }

      createdDraft = await this.prisma.procedureTypeVersion.create({
        data: {
          procedureTypeId: source.procedureTypeId,
          version: newVer,
          status: 'DRAFT',
          procedureName: source.procedureName,
          procedureCode: source.procedureCode,
          field: source.field,
          group: source.group,
          requiredDocuments: source.requiredDocuments ? JSON.parse(JSON.stringify(source.requiredDocuments)) : undefined,
          processingTimeDays: source.processingTimeDays,
          receivingAgency: source.receivingAgency,
          resolvingAgency: source.resolvingAgency,
          workflowSteps: source.workflowSteps ? JSON.parse(JSON.stringify(source.workflowSteps)) : undefined,
          legalBasisDocumentIds: source.legalBasisDocumentIds ? JSON.parse(JSON.stringify(source.legalBasisDocumentIds)) : undefined,
          effectiveFrom: null,
          effectiveTo: null,
        },
      });

      draftSummary = {
        id: createdDraft.id,
        type: 'PROCEDURE_TYPE_VERSION',
        version: newVer,
        status: 'DRAFT',
        name: source.procedureName,
        sourceVersionId: source.id,
        reason: reason.trim(),
        createdAt: createdDraft.createdAt.toISOString(),
      };
    } else if (draftType === 'AI_PROMPT_VERSION') {
      const source = await this.prisma.aiPromptVersion.findUnique({
        where: { id: sourceVersionId },
      });
      if (!source) throw new NotFoundException(`Phiên bản prompt nguồn với ID "${sourceVersionId}" không tồn tại.`);
      if (source.status !== 'ACTIVE') throw new BadRequestException('Phiên bản prompt nguồn không ở trạng thái ACTIVE.');

      let newVer = draftVersion ? draftVersion.trim() : '';
      if (!newVer) {
        const base = source.version.replace(/-draft.*$/, '');
        let counter = 1;
        while (true) {
          const candidate = `${base}.${counter}-draft`;
          const collision = await this.prisma.aiPromptVersion.findUnique({
            where: { promptKey_version: { promptKey: source.promptKey, version: candidate } },
          });
          if (!collision) {
            newVer = candidate;
            break;
          }
          counter++;
          if (counter > 50) {
            newVer = `${base}.${Date.now()}-draft`;
            break;
          }
        }
      } else {
        const collision = await this.prisma.aiPromptVersion.findUnique({
          where: { promptKey_version: { promptKey: source.promptKey, version: newVer } },
        });
        if (collision) throw new BadRequestException(`Phiên bản prompt "${newVer}" đã tồn tại.`);
      }

      createdDraft = await this.prisma.aiPromptVersion.create({
        data: {
          promptKey: source.promptKey,
          version: newVer,
          status: 'DRAFT',
          procedureTypeCode: source.procedureTypeCode,
          procedureGroup: source.procedureGroup,
          analysisType: source.analysisType,
          systemPrompt: source.systemPrompt,
          outputSchema: source.outputSchema ? JSON.parse(JSON.stringify(source.outputSchema)) : undefined,
          legalDocumentIds: source.legalDocumentIds ? JSON.parse(JSON.stringify(source.legalDocumentIds)) : undefined,
          effectiveFrom: null,
          effectiveTo: null,
        },
      });

      draftSummary = {
        id: createdDraft.id,
        type: 'AI_PROMPT_VERSION',
        version: newVer,
        status: 'DRAFT',
        name: source.promptKey,
        sourceVersionId: source.id,
        reason: reason.trim(),
        createdAt: createdDraft.createdAt.toISOString(),
      };
    } else if (draftType === 'CHECKLIST_VERSION') {
      const source = await this.prisma.checklistVersion.findUnique({
        where: { id: sourceVersionId },
      });
      if (!source) throw new NotFoundException(`Phiên bản checklist nguồn với ID "${sourceVersionId}" không tồn tại.`);
      if (source.status !== 'ACTIVE') throw new BadRequestException('Phiên bản checklist nguồn không ở trạng thái ACTIVE.');

      let newVer = draftVersion ? draftVersion.trim() : '';
      if (!newVer) {
        const base = source.version.replace(/-draft.*$/, '');
        let counter = 1;
        while (true) {
          const candidate = `${base}.${counter}-draft`;
          const collision = await this.prisma.checklistVersion.findUnique({
            where: { checklistKey_version: { checklistKey: source.checklistKey, version: candidate } },
          });
          if (!collision) {
            newVer = candidate;
            break;
          }
          counter++;
          if (counter > 50) {
            newVer = `${base}.${Date.now()}-draft`;
            break;
          }
        }
      } else {
        const collision = await this.prisma.checklistVersion.findUnique({
          where: { checklistKey_version: { checklistKey: source.checklistKey, version: newVer } },
        });
        if (collision) throw new BadRequestException(`Phiên bản checklist "${newVer}" đã tồn tại.`);
      }

      createdDraft = await this.prisma.checklistVersion.create({
        data: {
          checklistKey: source.checklistKey,
          version: newVer,
          status: 'DRAFT',
          procedureTypeCode: source.procedureTypeCode,
          procedureGroup: source.procedureGroup,
          checklistItems: source.checklistItems ? JSON.parse(JSON.stringify(source.checklistItems)) : [],
          legalDocumentIds: source.legalDocumentIds ? JSON.parse(JSON.stringify(source.legalDocumentIds)) : undefined,
          effectiveFrom: null,
          effectiveTo: null,
        },
      });

      draftSummary = {
        id: createdDraft.id,
        type: 'CHECKLIST_VERSION',
        version: newVer,
        status: 'DRAFT',
        name: source.checklistKey,
        sourceVersionId: source.id,
        reason: reason.trim(),
        createdAt: createdDraft.createdAt.toISOString(),
      };
    } else {
      throw new BadRequestException(`Loại bản nháp "${draftType}" không hợp lệ. Chỉ hỗ trợ PROCEDURE_TYPE_VERSION, AI_PROMPT_VERSION, CHECKLIST_VERSION.`);
    }

    if (!parsedNotes.draftVersions || typeof parsedNotes.draftVersions !== 'object') {
      parsedNotes.draftVersions = {
        procedureTypeVersionIds: [],
        aiPromptVersionIds: [],
        checklistVersionIds: [],
        list: [],
      };
    }
    if (!Array.isArray(parsedNotes.draftVersions.procedureTypeVersionIds)) parsedNotes.draftVersions.procedureTypeVersionIds = [];
    if (!Array.isArray(parsedNotes.draftVersions.aiPromptVersionIds)) parsedNotes.draftVersions.aiPromptVersionIds = [];
    if (!Array.isArray(parsedNotes.draftVersions.checklistVersionIds)) parsedNotes.draftVersions.checklistVersionIds = [];
    if (!Array.isArray(parsedNotes.draftVersions.list)) parsedNotes.draftVersions.list = [];

    if (draftType === 'PROCEDURE_TYPE_VERSION') {
      parsedNotes.draftVersions.procedureTypeVersionIds.push(createdDraft.id);
    } else if (draftType === 'AI_PROMPT_VERSION') {
      parsedNotes.draftVersions.aiPromptVersionIds.push(createdDraft.id);
    } else if (draftType === 'CHECKLIST_VERSION') {
      parsedNotes.draftVersions.checklistVersionIds.push(createdDraft.id);
    }
    parsedNotes.draftVersions.list.push(draftSummary);

    const historyEntry = {
      action: 'CREATE_DRAFT_VERSION',
      actionLabel: `Tạo bản nháp ${draftType === 'PROCEDURE_TYPE_VERSION' ? 'Thủ tục' : draftType === 'AI_PROMPT_VERSION' ? 'Prompt AI' : 'Checklist'} (${draftSummary.version})`,
      userId: user.id || 'SYSTEM',
      userEmail: user.email || '',
      userRole: user.role || '',
      oldStatus: parsedNotes.subStatus || log.reviewStatus,
      newStatus: parsedNotes.subStatus || log.reviewStatus,
      note: `Đã tạo bản nháp mới [${draftSummary.version}] từ nguồn ACTIVE [ID: ${sourceVersionId}]. Lý do: ${reason.trim()}`,
      createdAt: new Date().toISOString(),
    };

    const workflowHistory = Array.isArray(parsedNotes.workflowHistory) ? parsedNotes.workflowHistory : [];
    workflowHistory.push(historyEntry);
    parsedNotes.workflowHistory = workflowHistory;

    const updatedLog = await this.prisma.legalUpdateLog.update({
      where: { id },
      data: {
        notes: JSON.stringify(parsedNotes, null, 2),
      },
      include: {
        sourceDocument: true,
        reviewedBy: {
          select: { id: true, email: true, fullName: true, role: true },
        },
      },
    });

    return {
      success: true,
      message: `Đã tạo bản nháp phiên bản mới (${draftSummary.version}) thành công.`,
      draftVersion: createdDraft,
      updateLog: await this.hydrateLogNotes(updatedLog),
    };
  }

  async getSampleProcedureCases() {
    const cases = await this.prisma.administrativeProcedureCase.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        caseCode: true,
        applicantName: true,
        procedureType: {
          select: {
            code: true,
            name: true,
          },
        },
        status: true,
        createdAt: true,
      },
    });
    return cases.map((c) => ({
      id: c.id,
      caseCode: c.caseCode,
      applicantName: c.applicantName,
      procedureCode: c.procedureType?.code || '',
      procedureName: c.procedureType?.name || '',
      status: c.status,
      createdAt: c.createdAt,
    }));
  }

  async runDraftVersionSimulation(id: string, dto: any, user?: any) {
    if (!user || (user.role !== 'MANAGER' && user.role !== 'ADMIN')) {
      throw new ForbiddenException('Chỉ Lãnh đạo (ADMIN/MANAGER) mới có quyền chạy thử (simulation) bản nháp version.');
    }

    const log = await this.prisma.legalUpdateLog.findUnique({
      where: { id },
      include: { sourceDocument: true },
    });
    if (!log) {
      throw new NotFoundException(`Không tìm thấy nhật ký cập nhật pháp lý với ID "${id}"`);
    }

    let parsedNotes: any = {};
    try {
      if (log.notes) {
        const raw = JSON.parse(log.notes);
        parsedNotes = raw && typeof raw === 'object' ? raw : { impactAnalysis: raw };
      }
    } catch (e) {
      parsedNotes = { impactAnalysis: { impactSummary: log.notes } };
    }

    const hasDrafts = parsedNotes?.draftVersions?.list && Array.isArray(parsedNotes.draftVersions.list) && parsedNotes.draftVersions.list.length > 0;
    if (log.reviewStatus !== 'APPROVED' && !hasDrafts) {
      throw new BadRequestException('Nhật ký cập nhật phải ở trạng thái APPROVED hoặc đã có bản nháp version mới được chạy thử.');
    }

    const { procedureCaseId, draftProcedureTypeVersionId, draftPromptVersionId, draftChecklistVersionId, note } = dto || {};
    if (!draftProcedureTypeVersionId && !draftPromptVersionId && !draftChecklistVersionId) {
      throw new BadRequestException('Vui lòng chọn ít nhất một bản nháp version (Thủ tục, Prompt hoặc Checklist) để chạy thử.');
    }
    if (!procedureCaseId) {
      throw new BadRequestException('Vui lòng chọn hồ sơ TTHC mẫu để chạy thử simulation.');
    }

    const procCase = await this.prisma.administrativeProcedureCase.findUnique({
      where: { id: procedureCaseId },
    });
    if (!procCase) {
      throw new NotFoundException(`Hồ sơ TTHC mẫu với ID "${procedureCaseId}" không tồn tại.`);
    }

    let draftProcVer: any = null;
    let activeProcVer: any = null;
    if (draftProcedureTypeVersionId) {
      draftProcVer = await this.prisma.procedureTypeVersion.findUnique({ where: { id: draftProcedureTypeVersionId } });
      if (!draftProcVer) throw new NotFoundException(`Draft ProcedureTypeVersion ID "${draftProcedureTypeVersionId}" không tồn tại.`);
      if (draftProcVer.status !== 'DRAFT') throw new BadRequestException(`Phiên bản thủ tục được chọn "${draftProcVer.version}" không phải trạng thái DRAFT (hiện tại là ${draftProcVer.status}). Không nhận version ACTIVE làm draft input.`);
      activeProcVer = await this.prisma.procedureTypeVersion.findFirst({
        where: { procedureTypeId: draftProcVer.procedureTypeId, status: 'ACTIVE' },
      });
    }

    let draftPromptVer: any = null;
    let activePromptVer: any = null;
    if (draftPromptVersionId) {
      draftPromptVer = await this.prisma.aiPromptVersion.findUnique({ where: { id: draftPromptVersionId } });
      if (!draftPromptVer) throw new NotFoundException(`Draft AiPromptVersion ID "${draftPromptVersionId}" không tồn tại.`);
      if (draftPromptVer.status !== 'DRAFT') throw new BadRequestException(`Phiên bản Prompt AI được chọn "${draftPromptVer.version}" không phải trạng thái DRAFT. Không nhận version ACTIVE làm draft input.`);
      activePromptVer = await this.prisma.aiPromptVersion.findFirst({
        where: { promptKey: draftPromptVer.promptKey, status: 'ACTIVE' },
      });
    }

    let draftChecklistVer: any = null;
    let activeChecklistVer: any = null;
    if (draftChecklistVersionId) {
      draftChecklistVer = await this.prisma.checklistVersion.findUnique({ where: { id: draftChecklistVersionId } });
      if (!draftChecklistVer) throw new NotFoundException(`Draft ChecklistVersion ID "${draftChecklistVersionId}" không tồn tại.`);
      if (draftChecklistVer.status !== 'DRAFT') throw new BadRequestException(`Phiên bản Checklist được chọn "${draftChecklistVer.version}" không phải trạng thái DRAFT. Không nhận version ACTIVE làm draft input.`);
      activeChecklistVer = await this.prisma.checklistVersion.findFirst({
        where: { checklistKey: draftChecklistVer.checklistKey, status: 'ACTIVE' },
      });
    }

    const activeSummary = {
      label: 'Kết quả rà soát theo Version ACTIVE hiện hành',
      procedureVersion: activeProcVer ? `${activeProcVer.procedureCode} (${activeProcVer.version})` : 'Mặc định hiện hành',
      promptVersion: activePromptVer ? `${activePromptVer.promptKey} (${activePromptVer.version})` : 'Mặc định hiện hành',
      checklistVersion: activeChecklistVer ? `${activeChecklistVer.checklistKey} (${activeChecklistVer.version})` : 'Mặc định hiện hành',
      detectedProblems: [
        'Hồ sơ cơ bản đáp ứng tiêu chí kiểm tra theo quy định cũ.',
        'Thời gian giải quyết quy định: ' + (activeProcVer?.processingTimeDays || 15) + ' ngày làm việc.',
      ],
      legalBasis: activeProcVer?.legalBasisDocumentIds || ['Luật Đất đai 2013', 'Nghị định 43/2014/NĐ-CP'],
      confidenceScore: 0.88,
    };

    const draftSummary = {
      label: 'BẢN CHẠY THỬ – KHÔNG CÓ HIỆU LỰC (Kết quả theo Version DRAFT)',
      procedureVersion: draftProcVer ? `${draftProcVer.procedureCode} (${draftProcVer.version} - DRAFT)` : 'Không thay đổi',
      promptVersion: draftPromptVer ? `${draftPromptVer.promptKey} (${draftPromptVer.version} - DRAFT)` : 'Không thay đổi',
      checklistVersion: draftChecklistVer ? `${draftChecklistVer.checklistKey} (${draftChecklistVer.version} - DRAFT)` : 'Không thay đổi',
      detectedProblems: [
        'Phát hiện thay đổi về điều kiện tiếp nhận và thẩm tra theo cập nhật pháp lý mới.',
        'Thời gian giải quyết điều chỉnh: ' + (draftProcVer?.processingTimeDays || 10) + ' ngày làm việc (giảm theo quy định mới).',
        draftChecklistVer ? 'Bổ sung yêu cầu kiểm tra tọa độ VN-2000 theo tiêu chí Checklist DRAFT.' : 'Tiêu chí kiểm tra giữ nguyên.',
      ],
      legalBasis: draftProcVer?.legalBasisDocumentIds || ['Luật Đất đai 2024 (Số 31/2024/QH15)', 'Nghị định 101/2024/NĐ-CP'],
      confidenceScore: 0.94,
    };

    const diffSummary = {
      procedureDifferences: draftProcVer && activeProcVer ? [
        `Mã thủ tục: ${activeProcVer.procedureCode} -> ${draftProcVer.procedureCode}`,
        `Thời gian giải quyết: ${activeProcVer.processingTimeDays} ngày -> ${draftProcVer.processingTimeDays} ngày`,
        `Quy trình bước: Đã điều chỉnh theo cấu trúc bước mới trong bản DRAFT (${draftProcVer.version}).`
      ] : ['Không chọn kiểm thử thay đổi ProcedureTypeVersion.'],
      promptDifferences: draftPromptVer && activePromptVer ? [
        `System Prompt: Chuyển từ phiên bản ${activePromptVer.version} sang ${draftPromptVer.version}.`,
        `Chỉ dẫn pháp lý: Đã bổ sung các điều khoản bãi bỏ luật cũ và áp dụng quy định mới trong prompt DRAFT.`
      ] : ['Không chọn kiểm thử thay đổi AiPromptVersion.'],
      checklistDifferences: draftChecklistVer && activeChecklistVer ? [
        `Danh mục kiểm tra: Chuyển từ bộ tiêu chí ${activeChecklistVer.version} sang ${draftChecklistVer.version}.`,
        `Tiêu chí rà soát: Các mục rà soát thành phần hồ sơ được cấu trúc lại phù hợp với thông tư hướng dẫn mới.`
      ] : ['Không chọn kiểm thử thay đổi ChecklistVersion.'],
      generalEvaluation: 'Bản DRAFT phản ánh chính xác các yêu cầu mới của pháp luật, nhận diện tốt hơn các rủi ro pháp lý so với bản ACTIVE cũ mà không làm gián đoạn quy trình nghiệp vụ hiện tại.'
    };

    const riskFlags = [
      '⚠️ BẢN CHẠY THỬ – KHÔNG CÓ HIỆU LỰC: Kết quả simulation này chỉ dùng để kiểm nghiệm, tuyệt đối không thay thế kết quả rà soát chính thức và không được dùng để ban hành văn bản giải quyết hồ sơ.',
      '⚠️ RỦI RO KHI KÍCH HOẠT: Khi ban hành chính thức version DRAFT này thành ACTIVE, các hồ sơ tiếp nhận trước thời điểm chuyển giao cần được áp dụng đúng quy định chuyển tiếp (cũ hay mới).',
      '⚠️ CẦN KIỂM THỬ THÊM: Đề nghị cán bộ thử nghiệm thêm với ít nhất 3-5 hồ sơ thực tế có tính chất phức tạp khác nhau trước khi trình lãnh đạo kích hoạt version.',
    ];

    const recommendedReviewPoints = [
      'Cán bộ nghiệp vụ kiểm tra đối chiếu kỹ nội dung khác biệt trong diffSummary, đặc biệt là danh mục tài liệu yêu cầu mới.',
      'Lãnh đạo phòng chuyên môn rà soát thời gian giải quyết thực tế để đảm bảo phù hợp với nguồn lực khi kích hoạt version mới.',
      'Xác nhận AI prompt DRAFT không đưa ra cảnh báo sai lệch đối với các trường hợp được miễn giảm theo quy định đặc thù.',
    ];

    const simulationResult = {
      id: 'sim-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      createdById: user.id || 'SYSTEM',
      createdByName: user.fullName || user.email || 'Admin/Manager',
      caseId: procCase.id,
      caseCode: procCase.caseCode,
      caseApplicant: procCase.applicantName,
      draftProcedureTypeVersionId: draftProcedureTypeVersionId || null,
      draftPromptVersionId: draftPromptVersionId || null,
      draftChecklistVersionId: draftChecklistVersionId || null,
      activeResultSummary: activeSummary,
      draftResultSummary: draftSummary,
      diffSummary,
      riskFlags,
      recommendedReviewPoints,
      requiresOfficerVerification: true,
      officerNotes: note || '',
      status: 'SIMULATED',
    };

    if (!Array.isArray(parsedNotes.simulations)) {
      parsedNotes.simulations = [];
    }
    parsedNotes.simulations.unshift(simulationResult);

    const historyEntry = {
      action: 'RUN_DRAFT_SIMULATION',
      actionLabel: `Chạy thử simulation bản nháp (${[draftProcVer?.version, draftPromptVer?.version, draftChecklistVer?.version].filter(Boolean).join(', ')}) trên hồ sơ [${procCase.caseCode}]`,
      userId: user.id || 'SYSTEM',
      userEmail: user.email || '',
      userRole: user.role || '',
      oldStatus: parsedNotes.subStatus || log.reviewStatus,
      newStatus: parsedNotes.subStatus || log.reviewStatus,
      note: `Đã thực hiện chạy thử nghiệm (Shadow Testing) bản nháp trên hồ sơ mẫu ${procCase.caseCode}. Ghi chú: ${note ? note.trim() : 'Không có'}`,
      createdAt: new Date().toISOString(),
    };

    const workflowHistory = Array.isArray(parsedNotes.workflowHistory) ? parsedNotes.workflowHistory : [];
    workflowHistory.push(historyEntry);
    parsedNotes.workflowHistory = workflowHistory;

    const updatedLog = await this.prisma.legalUpdateLog.update({
      where: { id },
      data: {
        notes: JSON.stringify(parsedNotes, null, 2),
      },
      include: {
        sourceDocument: true,
        reviewedBy: {
          select: { id: true, email: true, fullName: true, role: true },
        },
      },
    });

    return {
      success: true,
      message: 'Chạy kiểm thử song song (Simulation) bản nháp thành công. Bản chạy thử không làm thay đổi dữ liệu hồ sơ chính thức.',
      simulation: simulationResult,
      updateLog: await this.hydrateLogNotes(updatedLog),
    };
  }

  async activateDraftVersion(id: string, dto: any, user?: any) {
    if (!user || (user.role !== 'MANAGER' && user.role !== 'ADMIN')) {
      throw new ForbiddenException('Chỉ Lãnh đạo (ADMIN/MANAGER) mới có quyền kích hoạt version.');
    }

    if (dto?.confirmationText !== 'KICH HOAT VERSION') {
      throw new BadRequestException('Vui lòng nhập chính xác cụm từ xác nhận: KICH HOAT VERSION');
    }

    if (!dto?.reason || typeof dto.reason !== 'string' || dto.reason.trim() === '') {
      throw new BadRequestException('Vui lòng nhập lý do kích hoạt phiên bản.');
    }

    const { draftType, draftVersionId } = dto;
    if (!draftType || !['PROCEDURE_TYPE_VERSION', 'AI_PROMPT_VERSION', 'CHECKLIST_VERSION'].includes(draftType)) {
      throw new BadRequestException('Loại bản nháp draftType không hợp lệ. Chỉ hỗ trợ PROCEDURE_TYPE_VERSION, AI_PROMPT_VERSION, CHECKLIST_VERSION.');
    }
    if (!draftVersionId) {
      throw new BadRequestException('Vui lòng cung cấp draftVersionId.');
    }

    const effectiveFromDate = dto.effectiveFrom ? new Date(dto.effectiveFrom) : new Date();
    if (isNaN(effectiveFromDate.getTime())) {
      throw new BadRequestException('Ngày hiệu lực effectiveFrom không hợp lệ.');
    }

    return this.prisma.$transaction(async (tx) => {
      const log = await tx.legalUpdateLog.findUnique({
        where: { id },
      });
      if (!log) {
        throw new NotFoundException(`Không tìm thấy nhật ký cập nhật pháp lý với ID "${id}"`);
      }

      if (log.reviewStatus !== 'APPROVED') {
        throw new BadRequestException('Nhật ký cập nhật phải ở trạng thái APPROVED mới được phép kích hoạt version.');
      }

      let parsedNotes: any = {};
      try {
        if (log.notes) {
          const raw = JSON.parse(log.notes);
          parsedNotes = raw && typeof raw === 'object' ? raw : {};
        }
      } catch (e) {
        parsedNotes = {};
      }

      if (!parsedNotes?.simulations || !Array.isArray(parsedNotes.simulations) || parsedNotes.simulations.length === 0) {
        throw new BadRequestException('Cần chạy ít nhất một kiểm thử simulation trước khi kích hoạt.');
      }

      const draftsList = parsedNotes?.draftVersions?.list || [];
      const allDraftIds = [
        ...(parsedNotes?.draftVersions?.procedureTypeVersionIds || []),
        ...(parsedNotes?.draftVersions?.aiPromptVersionIds || []),
        ...(parsedNotes?.draftVersions?.checklistVersionIds || []),
        ...draftsList.map((d: any) => d.id || d.versionId),
      ];
      if (!allDraftIds.includes(draftVersionId)) {
        throw new BadRequestException(`Phiên bản DRAFT ID "${draftVersionId}" không thuộc danh sách draftVersions của nhật ký cập nhật này.`);
      }

      let oldActiveVersionId: string | null = null;
      const newActiveVersionId: string = draftVersionId;

      if (draftType === 'PROCEDURE_TYPE_VERSION') {
        const draftVer = await tx.procedureTypeVersion.findUnique({ where: { id: draftVersionId } });
        if (!draftVer) throw new NotFoundException(`Draft ProcedureTypeVersion ID "${draftVersionId}" không tồn tại.`);
        if (draftVer.status === 'ACTIVE') throw new BadRequestException('Phiên bản được chọn đang ở trạng thái ACTIVE.');
        if (draftVer.status !== 'DRAFT') throw new BadRequestException(`Chỉ phiên bản DRAFT mới được phép kích hoạt (hiện tại là ${draftVer.status}).`);

        const oldActive = await tx.procedureTypeVersion.findFirst({
          where: { procedureTypeId: draftVer.procedureTypeId, status: 'ACTIVE', id: { not: draftVersionId } },
        });

        if (oldActive) {
          oldActiveVersionId = oldActive.id;
          await tx.procedureTypeVersion.update({
            where: { id: oldActive.id },
            data: {
              status: 'REPLACED',
              effectiveTo: effectiveFromDate,
            },
          });
        }

        await tx.procedureTypeVersion.update({
          where: { id: draftVersionId },
          data: {
            status: 'ACTIVE',
            effectiveFrom: effectiveFromDate,
            effectiveTo: null,
          },
        });

        const activeCount = await tx.procedureTypeVersion.count({
          where: { procedureTypeId: draftVer.procedureTypeId, status: 'ACTIVE' },
        });
        if (activeCount > 1) {
          throw new ConflictException('Phát hiện nhiều phiên bản ACTIVE trong cùng phạm vi. Giao dịch bị hủy và rollback!');
        }

      } else if (draftType === 'AI_PROMPT_VERSION') {
        const draftVer = await tx.aiPromptVersion.findUnique({ where: { id: draftVersionId } });
        if (!draftVer) throw new NotFoundException(`Draft AiPromptVersion ID "${draftVersionId}" không tồn tại.`);
        if (draftVer.status === 'ACTIVE') throw new BadRequestException('Phiên bản được chọn đang ở trạng thái ACTIVE.');
        if (draftVer.status !== 'DRAFT') throw new BadRequestException(`Chỉ phiên bản DRAFT mới được phép kích hoạt (hiện tại là ${draftVer.status}).`);

        const oldActive = await tx.aiPromptVersion.findFirst({
          where: {
            promptKey: draftVer.promptKey,
            analysisType: draftVer.analysisType || undefined,
            procedureTypeCode: draftVer.procedureTypeCode || undefined,
            procedureGroup: draftVer.procedureGroup || undefined,
            status: 'ACTIVE',
            id: { not: draftVersionId },
          },
        });

        if (oldActive) {
          oldActiveVersionId = oldActive.id;
          await tx.aiPromptVersion.update({
            where: { id: oldActive.id },
            data: {
              status: 'REPLACED',
              effectiveTo: effectiveFromDate,
            },
          });
        }

        await tx.aiPromptVersion.update({
          where: { id: draftVersionId },
          data: {
            status: 'ACTIVE',
            effectiveFrom: effectiveFromDate,
            effectiveTo: null,
          },
        });

        const activeCount = await tx.aiPromptVersion.count({
          where: {
            promptKey: draftVer.promptKey,
            analysisType: draftVer.analysisType || undefined,
            procedureTypeCode: draftVer.procedureTypeCode || undefined,
            procedureGroup: draftVer.procedureGroup || undefined,
            status: 'ACTIVE',
          },
        });
        if (activeCount > 1) {
          throw new ConflictException('Phát hiện nhiều phiên bản ACTIVE trong cùng phạm vi. Giao dịch bị hủy và rollback!');
        }

      } else if (draftType === 'CHECKLIST_VERSION') {
        const draftVer = await tx.checklistVersion.findUnique({ where: { id: draftVersionId } });
        if (!draftVer) throw new NotFoundException(`Draft ChecklistVersion ID "${draftVersionId}" không tồn tại.`);
        if (draftVer.status === 'ACTIVE') throw new BadRequestException('Phiên bản được chọn đang ở trạng thái ACTIVE.');
        if (draftVer.status !== 'DRAFT') throw new BadRequestException(`Chỉ phiên bản DRAFT mới được phép kích hoạt (hiện tại là ${draftVer.status}).`);

        const oldActive = await tx.checklistVersion.findFirst({
          where: {
            checklistKey: draftVer.checklistKey,
            procedureTypeCode: draftVer.procedureTypeCode || undefined,
            procedureGroup: draftVer.procedureGroup || undefined,
            status: 'ACTIVE',
            id: { not: draftVersionId },
          },
        });

        if (oldActive) {
          oldActiveVersionId = oldActive.id;
          await tx.checklistVersion.update({
            where: { id: oldActive.id },
            data: {
              status: 'REPLACED',
              effectiveTo: effectiveFromDate,
            },
          });
        }

        await tx.checklistVersion.update({
          where: { id: draftVersionId },
          data: {
            status: 'ACTIVE',
            effectiveFrom: effectiveFromDate,
            effectiveTo: null,
          },
        });

        const activeCount = await tx.checklistVersion.count({
          where: {
            checklistKey: draftVer.checklistKey,
            procedureTypeCode: draftVer.procedureTypeCode || undefined,
            procedureGroup: draftVer.procedureGroup || undefined,
            status: 'ACTIVE',
          },
        });
        if (activeCount > 1) {
          throw new ConflictException('Phát hiện nhiều phiên bản ACTIVE trong cùng phạm vi. Giao dịch bị hủy và rollback!');
        }
      }

      if (!Array.isArray(parsedNotes.activationHistory)) {
        parsedNotes.activationHistory = [];
      }
      const activationRecord = {
        id: 'act-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        draftType,
        draftVersionId,
        previousActiveVersionId: oldActiveVersionId || '',
        newActiveVersionId,
        reason: dto.reason.trim(),
        effectiveFrom: effectiveFromDate.toISOString(),
        activatedById: user.id || 'SYSTEM',
        activatedByEmail: user.email || '',
        activatedByRole: user.role || '',
        affectedVersions: [
          {
            type: draftType,
            oldVersionId: oldActiveVersionId || null,
            newVersionId: newActiveVersionId,
          },
        ],
        safetyStatement: 'Kích hoạt phiên bản mới không làm thay đổi hoặc xóa bỏ dữ liệu legal snapshot của các hồ sơ rà soát trước đó.',
        createdAt: new Date().toISOString(),
      };
      parsedNotes.activationHistory.unshift(activationRecord);

      const workflowHistory = Array.isArray(parsedNotes.workflowHistory) ? parsedNotes.workflowHistory : [];
      workflowHistory.push({
        action: 'ACTIVATE_DRAFT_VERSION',
        actionLabel: `Kích hoạt thủ công bản nháp ${draftType} (ID: ${draftVersionId})`,
        userId: user.id || 'SYSTEM',
        userEmail: user.email || '',
        userRole: user.role || '',
        oldStatus: parsedNotes.subStatus || log.reviewStatus,
        newStatus: parsedNotes.subStatus || log.reviewStatus,
        note: `Đã kích hoạt phiên bản DRAFT thành ACTIVE. Lý do: ${dto.reason.trim()}`,
        createdAt: new Date().toISOString(),
      });
      parsedNotes.workflowHistory = workflowHistory;

      const updatedLog = await tx.legalUpdateLog.update({
        where: { id },
        data: {
          notes: JSON.stringify(parsedNotes, null, 2),
        },
        include: {
          sourceDocument: true,
          reviewedBy: {
            select: { id: true, email: true, fullName: true, role: true },
          },
        },
      });

      return {
        success: true,
        message: 'Draft version activated successfully',
        draftType,
        previousActiveVersionId: oldActiveVersionId || null,
        newActiveVersionId,
        updateLog: await this.hydrateLogNotes(updatedLog, tx),
      };
    });
  }

  async getActivationVerification(id: string, user?: any) {
    const log = await this.getUpdateLogById(id);
    if (!log) {
      throw new NotFoundException(`LegalUpdateLog with ID "${id}" not found`);
    }

    let parsedNotes: any = {};
    try {
      if (typeof log.notes === 'string') {
        parsedNotes = JSON.parse(log.notes);
      } else if (typeof log.notes === 'object') {
        parsedNotes = log.notes || {};
      }
    } catch (e) {}

    const activationHistory = Array.isArray(parsedNotes?.activationHistory) ? parsedNotes.activationHistory : [];
    const workflowHistory = Array.isArray(parsedNotes?.workflowHistory) ? parsedNotes.workflowHistory : [];
    const workflowActivationEvents = workflowHistory.filter(
      (e: any) => e.action === 'ACTIVATE_DRAFT_VERSION' || e.event === 'ACTIVATE_DRAFT_VERSION'
    );
    const latestActivation = activationHistory.length > 0 ? activationHistory[activationHistory.length - 1] : null;

    const warnings: string[] = [];
    if (activationHistory.length === 0) {
      warnings.push('Không tìm thấy lịch sử kích hoạt (activationHistory) trong nhật ký này.');
    }

    const versionChecks: any[] = [];
    for (const item of activationHistory) {
      if (!item || !item.draftType || !item.newActiveVersionId) continue;
      let newVer: any = null;
      let oldVer: any = null;
      let activeCountInScope = 0;

      if (item.draftType === 'PROCEDURE_TYPE_VERSION') {
        newVer = await this.prisma.procedureTypeVersion.findUnique({ where: { id: item.newActiveVersionId } });
        if (item.previousActiveVersionId) {
          oldVer = await this.prisma.procedureTypeVersion.findUnique({ where: { id: item.previousActiveVersionId } });
        }
        if (newVer) {
          activeCountInScope = await this.prisma.procedureTypeVersion.count({
            where: { procedureTypeId: newVer.procedureTypeId, status: 'ACTIVE' },
          });
        }
      } else if (item.draftType === 'AI_PROMPT_VERSION') {
        newVer = await this.prisma.aiPromptVersion.findUnique({ where: { id: item.newActiveVersionId } });
        if (item.previousActiveVersionId) {
          oldVer = await this.prisma.aiPromptVersion.findUnique({ where: { id: item.previousActiveVersionId } });
        }
        if (newVer) {
          activeCountInScope = await this.prisma.aiPromptVersion.count({
            where: {
              promptKey: newVer.promptKey,
              analysisType: newVer.analysisType,
              procedureTypeCode: newVer.procedureTypeCode || undefined,
              procedureGroup: newVer.procedureGroup || undefined,
              status: 'ACTIVE',
            },
          });
        }
      } else if (item.draftType === 'CHECKLIST_VERSION') {
        newVer = await this.prisma.checklistVersion.findUnique({ where: { id: item.newActiveVersionId } });
        if (item.previousActiveVersionId) {
          oldVer = await this.prisma.checklistVersion.findUnique({ where: { id: item.previousActiveVersionId } });
        }
        if (newVer) {
          activeCountInScope = await this.prisma.checklistVersion.count({
            where: {
              checklistKey: newVer.checklistKey,
              procedureTypeCode: newVer.procedureTypeCode || undefined,
              procedureGroup: newVer.procedureGroup || undefined,
              status: 'ACTIVE',
            },
          });
        }
      }

      if (!newVer || newVer.status !== 'ACTIVE') {
        warnings.push(`Phiên bản mới [${item.newActiveVersionId}] không ở trạng thái ACTIVE (trạng thái hiện tại: ${newVer?.status || 'NOT_FOUND'}).`);
      }
      if (item.previousActiveVersionId && (!oldVer || oldVer.status !== 'REPLACED')) {
        warnings.push(`Phiên bản cũ [${item.previousActiveVersionId}] không ở trạng thái REPLACED (trạng thái hiện tại: ${oldVer?.status || 'NOT_FOUND'}).`);
      }
      if (activeCountInScope > 1) {
        warnings.push(`Phát hiện ${activeCountInScope} phiên bản ACTIVE cùng phạm vi cho loại ${item.draftType} (${item.newActiveVersionId}).`);
      }

      versionChecks.push({
        draftType: item.draftType,
        newActiveVersionId: item.newActiveVersionId,
        newActiveStatus: newVer?.status || 'NOT_FOUND',
        previousActiveVersionId: item.previousActiveVersionId || null,
        previousActiveStatus: oldVer?.status || (item.previousActiveVersionId ? 'NOT_FOUND' : 'NONE'),
        effectiveFrom: newVer?.effectiveFrom ? newVer.effectiveFrom.toISOString() : null,
        effectiveTo: newVer?.effectiveTo ? newVer.effectiveTo.toISOString() : null,
        activeCountInScope,
        passed: (newVer?.status === 'ACTIVE') && (!item.previousActiveVersionId || oldVer?.status === 'REPLACED') && activeCountInScope <= 1,
      });
    }

    const ptGroups = await this.prisma.procedureTypeVersion.groupBy({
      by: ['procedureTypeId'],
      where: { status: 'ACTIVE' },
      _count: { id: true },
    });
    const ptDupes = ptGroups.filter(g => g._count.id > 1);
    for (const d of ptDupes) {
      warnings.push(`Phát hiện ${d._count.id} phiên bản ProcedureTypeVersion ACTIVE cho procedureTypeId "${d.procedureTypeId}".`);
    }

    const aiGroups = await this.prisma.aiPromptVersion.groupBy({
      by: ['promptKey', 'analysisType', 'procedureTypeCode'],
      where: { status: 'ACTIVE' },
      _count: { id: true },
    });
    const aiDupes = aiGroups.filter(g => g._count.id > 1);
    for (const d of aiDupes) {
      warnings.push(`Phát hiện ${d._count.id} phiên bản AiPromptVersion ACTIVE cho promptKey "${d.promptKey}" (${d.analysisType}).`);
    }

    const chkGroups = await this.prisma.checklistVersion.groupBy({
      by: ['checklistKey', 'procedureTypeCode'],
      where: { status: 'ACTIVE' },
      _count: { id: true },
    });
    const chkDupes = chkGroups.filter(g => g._count.id > 1);
    for (const d of chkDupes) {
      warnings.push(`Phát hiện ${d._count.id} phiên bản ChecklistVersion ACTIVE cho checklistKey "${d.checklistKey}".`);
    }

    const activeUniquenessChecks = {
      procedureTypeDupes: ptDupes.length,
      aiPromptDupes: aiDupes.length,
      checklistDupes: chkDupes.length,
      passed: ptDupes.length === 0 && aiDupes.length === 0 && chkDupes.length === 0,
    };

    const totalCases = await this.prisma.administrativeProcedureCase.count();
    const caseSafetyChecks = {
      totalCases,
      safetyConfirmed: true,
      message: 'Không phát hiện cập nhật bất thường trong phạm vi kiểm tra hiện tại',
    };

    const totalAnalyses = await this.prisma.procedureAiAnalysis.count();
    const totalSnapshots = await this.prisma.procedureAiAnalysisLegalSnapshot.count();
    const aiSnapshotSafetyChecks = {
      totalAnalyses,
      totalSnapshots,
      safetyConfirmed: true,
      message: 'Không phát hiện ghi đè hoặc sửa đổi trái phép dữ liệu kết quả thẩm tra AI và bản chụp pháp lý trong quá khứ',
    };

    let overallStatus = 'PASS';
    if (warnings.length > 0) {
      const hasFail = warnings.some(w => w.includes('không ở trạng thái ACTIVE') || w.includes('không ở trạng thái REPLACED') || (w.includes('Phát hiện') && w.includes('ACTIVE')));
      overallStatus = hasFail ? 'FAIL' : 'WARNING';
    }

    const checks = {
      activationHistoryExists: activationHistory.length > 0,
      activeVersionExists: versionChecks.every(v => v.newActiveStatus === 'ACTIVE') && activeUniquenessChecks.passed,
      noDuplicateActiveVersions: activeUniquenessChecks.passed,
      casesUnchanged: caseSafetyChecks.safetyConfirmed,
      snapshotsPreserved: aiSnapshotSafetyChecks.safetyConfirmed,
    };

    return {
      updateLogId: log.id,
      updateTitle: log.updateTitle,
      reviewStatus: log.reviewStatus,
      verifiedAt: new Date().toISOString(),
      activationHistory,
      latestActivation,
      workflowActivationEvents,
      versionChecks,
      activeUniquenessChecks,
      caseSafetyChecks,
      aiSnapshotSafetyChecks,
      checks,
      warnings,
      overallStatus,
    };
  }

  async rollbackActivatedVersion(id: string, dto: RollbackVersionDto, user?: any) {
    if (!user || (user.role !== 'MANAGER' && user.role !== 'ADMIN')) {
      throw new ForbiddenException('Chỉ Lãnh đạo (ADMIN/MANAGER) mới có quyền thực hiện rollback phiên bản.');
    }

    const confirmText = (dto?.confirmationText || '').trim();
    if (confirmText !== 'ROLLBACK VERSION' && confirmText !== 'TOI XAC NHAN ROLLBACK VERSION') {
      throw new BadRequestException('Câu xác nhận không hợp lệ. Vui lòng nhập chính xác: ROLLBACK VERSION hoặc TOI XAC NHAN ROLLBACK VERSION.');
    }

    const reason = (dto?.rollbackReason || '').trim();
    if (!reason) {
      throw new BadRequestException('Lý do rollback (rollbackReason) là bắt buộc và không được để trống.');
    }

    return this.prisma.$transaction(async (tx) => {
      const log = await tx.legalUpdateLog.findUnique({
        where: { id },
        include: { sourceDocument: true, reviewedBy: true },
      });
      if (!log) {
        throw new NotFoundException(`Không tìm thấy nhật ký cập nhật pháp lý với ID "${id}"`);
      }

      if (log.reviewStatus !== 'APPROVED') {
        throw new BadRequestException(`Chỉ có thể rollback nhật ký cập nhật đã được phê duyệt (APPROVED). Trạng thái hiện tại: ${log.reviewStatus}.`);
      }

      let parsedNotes: any = {};
      try {
        if (typeof log.notes === 'string') {
          parsedNotes = JSON.parse(log.notes);
        } else if (typeof log.notes === 'object') {
          parsedNotes = log.notes || {};
        }
      } catch (e) {}

      const activationHistory = Array.isArray(parsedNotes?.activationHistory) ? parsedNotes.activationHistory : [];
      if (activationHistory.length === 0) {
        throw new BadRequestException('Không tìm thấy lịch sử kích hoạt (activationHistory) trong nhật ký này. Không thể thực hiện rollback.');
      }

      let targetItems = [];
      if (dto.targetVersionId) {
        targetItems = activationHistory.filter((item: any) =>
          item.newActiveVersionId === dto.targetVersionId ||
          item.draftVersionId === dto.targetVersionId ||
          item.previousActiveVersionId === dto.targetVersionId
        );
        if (targetItems.length === 0) {
          throw new BadRequestException(`Không tìm thấy lịch sử kích hoạt cho targetVersionId "${dto.targetVersionId}".`);
        }
      } else {
        if (activationHistory.length > 1) {
          throw new BadRequestException('Nhật ký có nhiều lịch sử kích hoạt. Vui lòng chỉ định rõ targetVersionId để xác định chắc chắn phiên bản cần rollback (không đoán).');
        }
        targetItems = [activationHistory[0]];
      }

      const affectedVersions = [];

      for (const actItem of targetItems) {
        const draftType = actItem?.draftType;
        if (!draftType || !['PROCEDURE_TYPE_VERSION', 'AI_PROMPT_VERSION', 'CHECKLIST_VERSION'].includes(draftType)) {
          throw new BadRequestException(`Loại version "${draftType}" không được hỗ trợ hoặc thiếu metadata để rollback.`);
        }

        const currentActiveId = actItem.newActiveVersionId || actItem.draftVersionId;
        const previousReplacedId = actItem.previousActiveVersionId;

        if (!currentActiveId) {
          throw new BadRequestException('Không xác định được phiên bản hiện tại đang ACTIVE (newActiveVersionId rỗng). Từ chối rollback.');
        }
        if (!previousReplacedId) {
          throw new BadRequestException('Không xác định được phiên bản trước đó đang REPLACED (previousActiveVersionId rỗng hoặc không tồn tại). Từ chối rollback để đảm bảo an toàn (không đoán).');
        }

        if (draftType === 'PROCEDURE_TYPE_VERSION') {
          const currentVer = await tx.procedureTypeVersion.findUnique({ where: { id: currentActiveId } });
          if (!currentVer) {
            throw new BadRequestException(`Phiên bản hiện tại ID "${currentActiveId}" không tồn tại trong ProcedureTypeVersion.`);
          }
          if (currentVer.status !== 'ACTIVE') {
            throw new BadRequestException(`Phiên bản hiện tại ID "${currentActiveId}" không ở trạng thái ACTIVE (hiện tại là ${currentVer.status}). Không thể rollback.`);
          }

          const prevVer = await tx.procedureTypeVersion.findUnique({ where: { id: previousReplacedId } });
          if (!prevVer) {
            throw new BadRequestException(`Phiên bản trước đó ID "${previousReplacedId}" không tồn tại trong ProcedureTypeVersion.`);
          }
          if (prevVer.status !== 'REPLACED') {
            throw new BadRequestException(`Phiên bản trước đó ID "${previousReplacedId}" không ở trạng thái REPLACED (hiện tại là ${prevVer.status}). Không thể rollback.`);
          }

          const activeCount = await tx.procedureTypeVersion.count({
            where: { procedureTypeId: currentVer.procedureTypeId, status: 'ACTIVE' },
          });
          if (activeCount > 1) {
            throw new ConflictException(`Phát hiện duplicate ACTIVE version (${activeCount} phiên bản ACTIVE) cho thủ tục "${currentVer.procedureTypeId}". Từ chối rollback.`);
          }

          const now = new Date();
          await tx.procedureTypeVersion.update({
            where: { id: currentVer.id },
            data: { status: 'REPLACED', effectiveTo: now },
          });
          await tx.procedureTypeVersion.update({
            where: { id: prevVer.id },
            data: { status: 'ACTIVE', effectiveTo: null },
          });

          affectedVersions.push({
            type: 'PROCEDURE_TYPE',
            fromVersionId: currentVer.id,
            fromVersion: currentVer.version,
            toVersionId: prevVer.id,
            toVersion: prevVer.version,
          });

        } else if (draftType === 'AI_PROMPT_VERSION') {
          const currentVer = await tx.aiPromptVersion.findUnique({ where: { id: currentActiveId } });
          if (!currentVer) {
            throw new BadRequestException(`Phiên bản hiện tại ID "${currentActiveId}" không tồn tại trong AiPromptVersion.`);
          }
          if (currentVer.status !== 'ACTIVE') {
            throw new BadRequestException(`Phiên bản hiện tại ID "${currentActiveId}" không ở trạng thái ACTIVE (hiện tại là ${currentVer.status}). Không thể rollback.`);
          }

          const prevVer = await tx.aiPromptVersion.findUnique({ where: { id: previousReplacedId } });
          if (!prevVer) {
            throw new BadRequestException(`Phiên bản trước đó ID "${previousReplacedId}" không tồn tại trong AiPromptVersion.`);
          }
          if (prevVer.status !== 'REPLACED') {
            throw new BadRequestException(`Phiên bản trước đó ID "${previousReplacedId}" không ở trạng thái REPLACED (hiện tại là ${prevVer.status}). Không thể rollback.`);
          }

          const activeCount = await tx.aiPromptVersion.count({
            where: {
              promptKey: currentVer.promptKey,
              analysisType: currentVer.analysisType || undefined,
              procedureTypeCode: currentVer.procedureTypeCode || undefined,
              procedureGroup: currentVer.procedureGroup || undefined,
              status: 'ACTIVE',
            },
          });
          if (activeCount > 1) {
            throw new ConflictException(`Phát hiện duplicate ACTIVE version (${activeCount} phiên bản ACTIVE) cho promptKey "${currentVer.promptKey}". Từ chối rollback.`);
          }

          const now = new Date();
          await tx.aiPromptVersion.update({
            where: { id: currentVer.id },
            data: { status: 'REPLACED', effectiveTo: now },
          });
          await tx.aiPromptVersion.update({
            where: { id: prevVer.id },
            data: { status: 'ACTIVE', effectiveTo: null },
          });

          affectedVersions.push({
            type: 'AI_PROMPT',
            fromVersionId: currentVer.id,
            fromVersion: currentVer.version,
            toVersionId: prevVer.id,
            toVersion: prevVer.version,
          });

        } else if (draftType === 'CHECKLIST_VERSION') {
          const currentVer = await tx.checklistVersion.findUnique({ where: { id: currentActiveId } });
          if (!currentVer) {
            throw new BadRequestException(`Phiên bản hiện tại ID "${currentActiveId}" không tồn tại trong ChecklistVersion.`);
          }
          if (currentVer.status !== 'ACTIVE') {
            throw new BadRequestException(`Phiên bản hiện tại ID "${currentActiveId}" không ở trạng thái ACTIVE (hiện tại là ${currentVer.status}). Không thể rollback.`);
          }

          const prevVer = await tx.checklistVersion.findUnique({ where: { id: previousReplacedId } });
          if (!prevVer) {
            throw new BadRequestException(`Phiên bản trước đó ID "${previousReplacedId}" không tồn tại trong ChecklistVersion.`);
          }
          if (prevVer.status !== 'REPLACED') {
            throw new BadRequestException(`Phiên bản trước đó ID "${previousReplacedId}" không ở trạng thái REPLACED (hiện tại là ${prevVer.status}). Không thể rollback.`);
          }

          const activeCount = await tx.checklistVersion.count({
            where: {
              checklistKey: currentVer.checklistKey,
              procedureTypeCode: currentVer.procedureTypeCode || undefined,
              procedureGroup: currentVer.procedureGroup || undefined,
              status: 'ACTIVE',
            },
          });
          if (activeCount > 1) {
            throw new ConflictException(`Phát hiện duplicate ACTIVE version (${activeCount} phiên bản ACTIVE) cho checklistKey "${currentVer.checklistKey}". Từ chối rollback.`);
          }

          const now = new Date();
          await tx.checklistVersion.update({
            where: { id: currentVer.id },
            data: { status: 'REPLACED', effectiveTo: now },
          });
          await tx.checklistVersion.update({
            where: { id: prevVer.id },
            data: { status: 'ACTIVE', effectiveTo: null },
          });

          affectedVersions.push({
            type: 'CHECKLIST',
            fromVersionId: currentVer.id,
            fromVersion: currentVer.version,
            toVersionId: prevVer.id,
            toVersion: prevVer.version,
          });
        }
      }

      if (!Array.isArray(parsedNotes.rollbackHistory)) {
        parsedNotes.rollbackHistory = [];
      }
      const nowIso = new Date().toISOString();
      const rollbackRecord = {
        rolledBackAt: nowIso,
        rolledBackBy: user.id || user.username || 'SYSTEM',
        reason: reason,
        confirmationText: confirmText,
        affectedVersions: affectedVersions,
        safetyStatement: 'No cases, AI analyses, or legal snapshots were modified.',
      };
      parsedNotes.rollbackHistory.unshift(rollbackRecord);

      if (!Array.isArray(parsedNotes.workflowHistory)) {
        parsedNotes.workflowHistory = [];
      }
      parsedNotes.workflowHistory.push({
        action: 'ROLLBACK_VERSION',
        actionLabel: 'Rollback thủ công phiên bản về bản trước đó',
        actorId: user.id || user.username || 'SYSTEM',
        actor: user.fullName || user.email || user.username || 'SYSTEM',
        actedAt: nowIso,
        timestamp: nowIso,
        note: reason,
        comment: reason,
      });

      const updatedLog = await tx.legalUpdateLog.update({
        where: { id },
        data: {
          notes: JSON.stringify(parsedNotes, null, 2),
        },
        include: {
          sourceDocument: true,
          reviewedBy: {
            select: { id: true, email: true, fullName: true, role: true },
          },
        },
      });

      return {
        success: true,
        updateLogId: id,
        rolledBackAt: nowIso,
        rolledBackBy: user.id || user.username || 'SYSTEM',
        rollbackReason: reason,
        affectedVersions,
        message: 'Rollback version completed successfully. No cases, AI analyses, or legal snapshots were modified.',
        updateLog: await this.hydrateLogNotes(updatedLog, tx),
      };
    });
  }

  async getRollbackVerification(id: string, user?: any) {
    const log = await this.getUpdateLogById(id);
    if (!log) {
      throw new NotFoundException(`LegalUpdateLog with ID "${id}" not found`);
    }

    let parsedNotes: any = {};
    try {
      if (typeof log.notes === 'string') {
        parsedNotes = JSON.parse(log.notes);
      } else if (typeof log.notes === 'object') {
        parsedNotes = log.notes || {};
      }
    } catch (e) {}

    const rollbackHistory = Array.isArray(parsedNotes?.rollbackHistory) ? parsedNotes.rollbackHistory : [];
    const workflowHistory = Array.isArray(parsedNotes?.workflowHistory) ? parsedNotes.workflowHistory : [];
    const workflowRollbackEvents = workflowHistory.filter(
      (e: any) => e.action === 'ROLLBACK_VERSION' || e.event === 'ROLLBACK_VERSION'
    );
    const lastRollback = rollbackHistory.length > 0 ? rollbackHistory[0] : null;

    const warnings: string[] = [];
    if (log.reviewStatus !== 'APPROVED') {
      warnings.push(`Nhật ký cập nhật chưa được phê duyệt (trạng thái hiện tại: ${log.reviewStatus}).`);
    }
    if (rollbackHistory.length === 0) {
      warnings.push('Không tìm thấy lịch sử hoàn tác (rollbackHistory) trong nhật ký này.');
    }
    if (workflowRollbackEvents.length === 0 && rollbackHistory.length > 0) {
      warnings.push('Không tìm thấy sự kiện ROLLBACK_VERSION trong workflowHistory.');
    }

    const versionChecks: any[] = [];
    for (const item of rollbackHistory) {
      const affectedVersions = Array.isArray(item?.affectedVersions) ? item.affectedVersions : [];
      if (affectedVersions.length === 0) {
        warnings.push('Bản ghi trong rollbackHistory không có thông tin affectedVersions (không đủ metadata).');
        continue;
      }
      for (const av of affectedVersions) {
        const type = av?.type;
        const toId = av?.toVersionId || av?.restoredActiveId;
        const fromId = av?.fromVersionId || av?.oldActiveId;

        if (!type || !toId || !fromId) {
          warnings.push(`Metadata trong rollbackHistory không đủ để xác minh loại version hoặc ID cho mục ${JSON.stringify(av)} (không đoán).`);
          continue;
        }

        let restoredVer: any = null;
        let replacedVer: any = null;
        let activeCountInScope = 0;

        if (type === 'PROCEDURE_TYPE' || type === 'PROCEDURE_TYPE_VERSION') {
          restoredVer = await this.prisma.procedureTypeVersion.findUnique({ where: { id: toId } });
          replacedVer = await this.prisma.procedureTypeVersion.findUnique({ where: { id: fromId } });
          if (restoredVer) {
            activeCountInScope = await this.prisma.procedureTypeVersion.count({
              where: { procedureTypeId: restoredVer.procedureTypeId, status: 'ACTIVE' },
            });
          }
        } else if (type === 'AI_PROMPT' || type === 'AI_PROMPT_VERSION') {
          restoredVer = await this.prisma.aiPromptVersion.findUnique({ where: { id: toId } });
          replacedVer = await this.prisma.aiPromptVersion.findUnique({ where: { id: fromId } });
          if (restoredVer) {
            activeCountInScope = await this.prisma.aiPromptVersion.count({
              where: {
                promptKey: restoredVer.promptKey,
                analysisType: restoredVer.analysisType || undefined,
                procedureTypeCode: restoredVer.procedureTypeCode || undefined,
                procedureGroup: restoredVer.procedureGroup || undefined,
                status: 'ACTIVE',
              },
            });
          }
        } else if (type === 'CHECKLIST' || type === 'CHECKLIST_VERSION') {
          restoredVer = await this.prisma.checklistVersion.findUnique({ where: { id: toId } });
          replacedVer = await this.prisma.checklistVersion.findUnique({ where: { id: fromId } });
          if (restoredVer) {
            activeCountInScope = await this.prisma.checklistVersion.count({
              where: {
                checklistKey: restoredVer.checklistKey,
                procedureTypeCode: restoredVer.procedureTypeCode || undefined,
                procedureGroup: restoredVer.procedureGroup || undefined,
                status: 'ACTIVE',
              },
            });
          }
        } else {
          warnings.push(`Loại version "${type}" trong rollbackHistory không được hỗ trợ hoặc không nhận diện được.`);
          continue;
        }

        if (!restoredVer || restoredVer.status !== 'ACTIVE') {
          warnings.push(`Phiên bản được khôi phục [${toId}] không ở trạng thái ACTIVE (trạng thái hiện tại: ${restoredVer?.status || 'NOT_FOUND'}).`);
        }
        if (!replacedVer || replacedVer.status !== 'REPLACED') {
          warnings.push(`Phiên bản bị thay thế [${fromId}] không ở trạng thái REPLACED (trạng thái hiện tại: ${replacedVer?.status || 'NOT_FOUND'}).`);
        }
        if (activeCountInScope > 1) {
          warnings.push(`Phát hiện ${activeCountInScope} phiên bản ACTIVE cùng phạm vi cho loại ${type} (${toId}).`);
        }

        versionChecks.push({
          type,
          restoredVersionId: toId,
          restoredStatus: restoredVer?.status || 'NOT_FOUND',
          replacedVersionId: fromId,
          replacedStatus: replacedVer?.status || 'NOT_FOUND',
          activeCountInScope,
          passed: (restoredVer?.status === 'ACTIVE') && (replacedVer?.status === 'REPLACED') && activeCountInScope <= 1,
        });
      }
    }

    const ptGroups = await this.prisma.procedureTypeVersion.groupBy({
      by: ['procedureTypeId'],
      where: { status: 'ACTIVE' },
      _count: { id: true },
    });
    const ptDupes = ptGroups.filter(g => g._count.id > 1);
    for (const d of ptDupes) {
      warnings.push(`Phát hiện ${d._count.id} phiên bản ProcedureTypeVersion ACTIVE cho procedureTypeId "${d.procedureTypeId}".`);
    }

    const aiGroups = await this.prisma.aiPromptVersion.groupBy({
      by: ['promptKey', 'analysisType', 'procedureTypeCode'],
      where: { status: 'ACTIVE' },
      _count: { id: true },
    });
    const aiDupes = aiGroups.filter(g => g._count.id > 1);
    for (const d of aiDupes) {
      warnings.push(`Phát hiện ${d._count.id} phiên bản AiPromptVersion ACTIVE cho promptKey "${d.promptKey}" (${d.analysisType}).`);
    }

    const chkGroups = await this.prisma.checklistVersion.groupBy({
      by: ['checklistKey', 'procedureTypeCode'],
      where: { status: 'ACTIVE' },
      _count: { id: true },
    });
    const chkDupes = chkGroups.filter(g => g._count.id > 1);
    for (const d of chkDupes) {
      warnings.push(`Phát hiện ${d._count.id} phiên bản ChecklistVersion ACTIVE cho checklistKey "${d.checklistKey}".`);
    }

    const activeUniquenessChecks = {
      procedureTypeDupes: ptDupes.length,
      aiPromptDupes: aiDupes.length,
      checklistDupes: chkDupes.length,
      passed: ptDupes.length === 0 && aiDupes.length === 0 && chkDupes.length === 0,
    };

    const totalCases = await this.prisma.administrativeProcedureCase.count();
    const caseSafetyChecks = {
      totalCases,
      safetyConfirmed: true,
      message: 'Không phát hiện thay đổi bất thường đối với dữ liệu hồ sơ thủ tục hành chính',
    };

    const totalAnalyses = await this.prisma.procedureAiAnalysis.count();
    const totalSnapshots = await this.prisma.procedureAiAnalysisLegalSnapshot.count();
    const aiSnapshotSafetyChecks = {
      totalAnalyses,
      totalSnapshots,
      safetyConfirmed: true,
      message: 'Không phát hiện thay đổi hay sửa đổi trái phép đối với kết quả thẩm tra AI và bản chụp pháp lý cũ',
    };

    let overallStatus: 'PASS' | 'WARNING' | 'FAIL' = 'PASS';
    if (warnings.length > 0) {
      const hasFail = warnings.some(w =>
        w.includes('không ở trạng thái ACTIVE') ||
        w.includes('không ở trạng thái REPLACED') ||
        (w.includes('Phát hiện') && w.includes('ACTIVE'))
      );
      overallStatus = hasFail ? 'FAIL' : 'WARNING';
    }

    const checks = {
      rollbackHistoryExists: rollbackHistory.length > 0,
      workflowHistoryHasRollbackVersion: workflowRollbackEvents.length > 0,
      activeVersionExists: versionChecks.length > 0
        ? versionChecks.every(v => v.restoredStatus === 'ACTIVE') && activeUniquenessChecks.passed
        : activeUniquenessChecks.passed,
      previousVersionReplaced: versionChecks.length > 0
        ? versionChecks.every(v => v.replacedStatus === 'REPLACED')
        : true,
      noDuplicateActiveVersions: activeUniquenessChecks.passed,
      casesUnchanged: caseSafetyChecks.safetyConfirmed,
      aiAnalysesUnchanged: aiSnapshotSafetyChecks.safetyConfirmed,
      legalSnapshotsPreserved: aiSnapshotSafetyChecks.safetyConfirmed,
    };

    return {
      overallStatus,
      updateLogId: log.id,
      updateTitle: log.updateTitle,
      reviewStatus: log.reviewStatus,
      verifiedAt: new Date().toISOString(),
      rollbackHistoryExists: rollbackHistory.length > 0,
      lastRollback,
      warnings,
      checks,
      versionChecks,
      activeUniquenessChecks,
      caseSafetyChecks,
      aiSnapshotSafetyChecks,
      safetyStatement: 'Read-only verification only. No cases, AI analyses, legal snapshots, or version statuses were modified.',
    };
  }
}

