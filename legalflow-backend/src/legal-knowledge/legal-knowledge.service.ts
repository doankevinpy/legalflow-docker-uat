import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LegalUpdateReviewStatus } from '@prisma/client';

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
        reviewedBy: {
          select: { id: true, email: true, fullName: true, role: true },
        },
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
    return log;
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
      updateLog: updatedLog,
    };
  }
}
