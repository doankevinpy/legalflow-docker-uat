import { Injectable, Inject, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProcedureAiPromptBuilder } from './procedure-ai-prompt.builder';
import { AI_PROVIDER_TOKEN } from '../../ai/interfaces/ai-provider.interface';
import type { IAiProvider } from '../../ai/interfaces/ai-provider.interface';
import { Packer } from 'docx';
import { getAgencyConfig } from '../../config/agency.config';
import { buildLandFirstCertReviewDocx } from './procedure-docx.helper';

@Injectable()
export class ProcedureAiService {
  private readonly logger = new Logger(ProcedureAiService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly promptBuilder: ProcedureAiPromptBuilder,
    @Inject(AI_PROVIDER_TOKEN) private readonly aiProvider: IAiProvider,
  ) {}

  private async resolveUserId(userId?: string): Promise<string> {
    if (!userId || typeof userId !== 'string' || !userId.trim()) {
      throw new BadRequestException('Không xác định được người dùng đang thao tác');
    }
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!existingUser) {
      throw new BadRequestException('Không xác định được người dùng đang thao tác');
    }
    return existingUser.id;
  }

  async reviewLandFirstCertificate(caseId: string, userId?: string) {
    const effectiveUserId = await this.resolveUserId(userId);

    const caseItem = await this.prisma.administrativeProcedureCase.findUnique({
      where: { id: caseId },
      include: {
        procedureType: true,
        documents: true,
        checklistItems: true,
        procedureNotes: true,
      },
    });

    if (!caseItem) {
      throw new NotFoundException(`Hồ sơ TTHC với ID ${caseId} không tồn tại.`);
    }

    if (
      caseItem.procedureType.code !== 'LAND_FIRST_CERTIFICATE' &&
      caseItem.procedureType.group !== 'CAP_GCN_LAN_DAU'
    ) {
      throw new BadRequestException(
        'Chức năng này chỉ áp dụng cho hồ sơ cấp Giấy chứng nhận quyền sử dụng đất lần đầu.',
      );
    }

    const inputSnapshot = {
      caseCode: caseItem.caseCode,
      procedureTypeCode: caseItem.procedureType.code,
      procedureTypeName: caseItem.procedureType.name,
      applicantName: caseItem.applicantName,
      applicantAddress: caseItem.applicantAddress,
      applicantPhone: caseItem.applicantPhone,
      landParcelSummary: caseItem.landParcelSummary || {},
      constructionSummary: caseItem.constructionSummary || {},
      status: caseItem.status,
      receivedAt: caseItem.receivedAt,
      dueDate: caseItem.dueDate,
      documents: caseItem.documents.map((d) => ({
        title: d.title,
        documentType: d.documentType,
        reviewStatus: d.reviewStatus,
      })),
      checklistItems: caseItem.checklistItems.map((c) => ({
        title: c.title,
        isCompleted: c.isCompleted,
        checklistGroup: c.checklistGroup,
      })),
      notes: caseItem.procedureNotes.map((n) => ({
        content: n.content,
        noteType: n.noteType,
      })),
    };

    const { systemPrompt, userPrompt } =
      this.promptBuilder.buildLandFirstCertificateReviewPrompt(inputSnapshot);

    const parcelInfo: any = caseItem.landParcelSummary || {};
    const fallbackPayload = {
      disclaimer: 'BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA',
      analysisType: 'LAND_FIRST_CERTIFICATE_REVIEW',
      summary: `Hồ sơ ${caseItem.caseCode} tiếp nhận yêu cầu cấp Giấy chứng nhận quyền sử dụng đất lần đầu cho chủ sở hữu ${caseItem.applicantName}. Hiện đang ở trạng thái ${caseItem.status}.`,
      procedureType: caseItem.procedureType.name,
      applicantReview: {
        applicantName: caseItem.applicantName,
        identityInfoStatus: 'Cần xác minh đối chiếu bản gốc CCCD/Mã định danh cá nhân với cơ sở dữ liệu quốc gia về dân cư.',
        addressStatus: caseItem.applicantAddress || 'Chưa ghi nhận địa chỉ liên hệ cụ thể, cần yêu cầu bổ sung.',
        issuesToVerify: [
          'Xác minh tư cách pháp lý của chủ thể nộp đơn đăng ký cấp GCN lần đầu.',
          'Kiểm tra sự thống nhất thông tin giữa Đơn đăng ký (Mẫu số 04a/ĐK) và giấy tờ tùy thân của người sử dụng đất.',
        ],
      },
      landParcelReview: {
        parcelNumber: parcelInfo.parcelNumber || 'Chưa kê khai số thửa',
        mapSheetNumber: parcelInfo.mapSheetNumber || 'Chưa kê khai tờ bản đồ',
        location: parcelInfo.address || 'Chưa kê khai vị trí chi tiết',
        area: parcelInfo.area || 'Chưa kê khai diện tích',
        landUseType: parcelInfo.landType || 'Đất ở / Đất nông nghiệp',
        boundaryStatus: 'Cần đối chiếu với trích lục bản đồ địa chính hoặc hồ sơ đo đạc kỹ thuật thửa đất mới nhất.',
        issuesToVerify: [
          'Kiểm tra ranh giới thửa đất hiện trạng có tranh chấp, chồng lấn với các hộ sử dụng đất liền kề hay không.',
          'Đối chiếu diện tích đo đạc thực tế so với diện tích ghi nhận trên các giấy tờ cũ (nếu có).',
        ],
      },
      originAndUseHistoryReview: {
        declaredOrigin: parcelInfo.origin || 'Khai phá / Nhận chuyển nhượng / Được giao',
        declaredUseStartTime: 'Cần cán bộ bổ sung/kiểm tra căn cứ xác định thời điểm bắt đầu sử dụng đất ổn định.',
        supportingDocuments: caseItem.documents.map((d) => d.title),
        riskFlags: [
          'Lưu ý kiểm tra kỹ rủi ro giấy tờ chuyển nhượng viết tay chưa qua công chứng/chứng thực (nếu có).',
          'Cần cán bộ thẩm tra thực tế quá trình sử dụng đất liên tục tại địa phương để phân định mốc thời gian trước hay sau 15/10/1993, 01/07/2004, 01/07/2014.',
        ],
        issuesToVerify: [
          'Xác định rõ căn cứ áp dụng Điều 137 hay Điều 138 Luật Đất đai 2024.',
          'Đối chiếu thông tin sổ mục kê, bản đồ địa chính qua các thời kỳ lưu trữ tại UBND xã/phường.',
        ],
      },
      documentCompletenessReview: {
        detectedDocuments: caseItem.documents.map((d) => `${d.title} (${d.documentType})`),
        missingOrNeedCheckDocuments: [
          'Xác nhận của UBND cấp xã về nguồn gốc và thời điểm sử dụng đất.',
          'Xác nhận của UBND cấp xã về việc đất sử dụng ổn định, không có tranh chấp.',
        ],
        recommendSupplementDocuments: [
          'Phiếu lấy ý kiến khu dân cư về nguồn gốc và thời điểm sử dụng đất (nếu thiếu giấy tờ theo Điều 137 Luật Đất đai 2024).',
        ],
      },
      planningDisputeAndCurrentStatusReview: {
        planningNeedCheck: [
          'Kiểm tra sự phù hợp với Quy hoạch sử dụng đất cấp huyện hoặc Quy hoạch chi tiết xây dựng đô thị/điểm dân cư nông thôn đã được phê duyệt.',
        ],
        disputeNeedCheck: [
          'Xác minh hồ sơ lưu trữ về khiếu nại, tranh chấp đất đai tại địa phương và TAND cấp huyện.',
        ],
        currentUseNeedCheck: [
          'Thẩm tra hiện trạng sử dụng đất thực tế trên thực địa có đúng mục đích kê khai hay không.',
        ],
        attachedAssetsNeedCheck: [
          'Kiểm tra nhà ở, công trình xây dựng trên đất có vi phạm hành lang bảo vệ an toàn công trình công cộng hay không.',
        ],
      },
      financialObligationNotice: {
        status: 'NOT_CALCULATED_IN_THIS_PHASE',
        message: 'Phase này chỉ cảnh báo nội dung cần kiểm tra về nghĩa vụ tài chính, không lập bảng tính tiền sử dụng đất.',
      },
      legalBasisToCheck: [
        'Điều 137, 138 Luật Đất đai năm 2024 quy định cấp GCN quyền sử dụng đất cho hộ gia đình, cá nhân đang sử dụng đất.',
        'Nghị định 101/2024/NĐ-CP quy định về đăng ký đất đai, tài sản gắn liền với đất.',
        'Nghị định 102/2024/NĐ-CP hướng dẫn thi hành chi tiết Luật Đất đai.',
      ],
      riskFlags: [
        'Cần xác định chính xác thời điểm bắt đầu sử dụng đất để tránh sai sót trong xác định tiền sử dụng đất sau này.',
        'Không tự ý kết luận hồ sơ đủ điều kiện khi chưa có kết quả kiểm tra thực địa và niêm yết công khai tại địa phương.',
      ],
      recommendations: [
        'Đề nghị gửi văn bản đề nghị UBND cấp xã nơi có đất kiểm tra hiện trạng, xác nhận nguồn gốc, thời điểm sử dụng và tình trạng tranh chấp.',
        'Niêm yết công khai kết quả kiểm tra hồ sơ đăng ký cấp GCN tại trụ sở UBND xã theo quy định trong 15 ngày.',
      ],
      recommendedNextQuestions: [
        'Ông/bà bắt đầu sử dụng diện tích đất này từ thời điểm chính xác nào và có giấy tờ gì chứng minh hay không?',
        'Diện tích đất trên có từng xảy ra tranh chấp về ranh giới với các hộ liền kề hoặc bị lập biên bản vi phạm hành chính hay không?',
      ],
      officerChecklist: [
        'Kiểm tra Đơn đăng ký cấp GCN theo Mẫu số 04a/ĐK',
        'Đối chiếu bản sao chứng thực giấy tờ tùy thân của người sử dụng đất',
        'Kiểm tra Trích lục / Trích đo địa chính thửa đất',
        'Thẩm định Văn bản xác nhận của UBND cấp xã về nguồn gốc, hiện trạng và tranh chấp',
        'Kiểm tra sự phù hợp với quy hoạch sử dụng đất cấp huyện',
      ],
      confidenceLevel: 'MEDIUM',
      requiresOfficerVerification: true,
    };

    let outputPayload: any;

    try {
      if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_API_KEY_HERE') {
        const response = await this.aiProvider.generateText(systemPrompt, userPrompt);
        let contentStr = response?.content || '';
        const jsonMatch = contentStr.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          contentStr = jsonMatch[0];
        }
        outputPayload = JSON.parse(contentStr);
        if (!outputPayload || typeof outputPayload !== 'object') {
          outputPayload = fallbackPayload;
        } else {
          outputPayload = {
            ...fallbackPayload,
            ...outputPayload,
            applicantReview: { ...fallbackPayload.applicantReview, ...(outputPayload.applicantReview || {}) },
            landParcelReview: { ...fallbackPayload.landParcelReview, ...(outputPayload.landParcelReview || {}) },
            originAndUseHistoryReview: { ...fallbackPayload.originAndUseHistoryReview, ...(outputPayload.originAndUseHistoryReview || {}) },
            documentCompletenessReview: { ...fallbackPayload.documentCompletenessReview, ...(outputPayload.documentCompletenessReview || {}) },
            planningDisputeAndCurrentStatusReview: { ...fallbackPayload.planningDisputeAndCurrentStatusReview, ...(outputPayload.planningDisputeAndCurrentStatusReview || {}) },
            financialObligationNotice: { ...fallbackPayload.financialObligationNotice, ...(outputPayload.financialObligationNotice || {}) },
          };
        }
      } else {
        outputPayload = fallbackPayload;
      }
    } catch (err: any) {
      this.logger.warn(`AI Provider fallback for Land First Certificate Review: ${err?.message || err}`);
      outputPayload = fallbackPayload;
    }

    const analysis = await this.prisma.procedureAiAnalysis.create({
      data: {
        procedureCaseId: caseItem.id,
        analysisType: 'LAND_FIRST_CERTIFICATE_REVIEW',
        inputSnapshot: inputSnapshot as any,
        outputPayload: outputPayload as any,
        disclaimer: outputPayload.disclaimer || 'BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA',
        confidenceLevel: outputPayload.confidenceLevel || 'MEDIUM',
        status: 'PENDING',
        createdById: effectiveUserId,
      },
    });

    await this.prisma.procedureAuditLog.create({
      data: {
        procedureCaseId: caseItem.id,
        userId: effectiveUserId,
        actionType: 'CREATE_AI_ANALYSIS',
        entityType: 'ProcedureAiAnalysis',
        entityId: analysis.id,
        inputPayload: { analysisType: 'LAND_FIRST_CERTIFICATE_REVIEW' },
        outputPayload: { analysisId: analysis.id, status: analysis.status },
      },
    });

    return analysis;
  }

  async getAnalysesByCaseId(caseId: string) {
    return this.prisma.procedureAiAnalysis.findMany({
      where: { procedureCaseId: caseId },
      include: {
        createdBy: { select: { id: true, fullName: true, email: true, role: true } },
        reviewedBy: { select: { id: true, fullName: true, email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async acceptAnalysis(
    caseId: string,
    analysisId: string,
    userId?: string,
    options?: { saveToNote?: boolean; applyChecklist?: boolean },
  ) {
    const effectiveUserId = await this.resolveUserId(userId);

    const analysis = await this.prisma.procedureAiAnalysis.findUnique({
      where: { id: analysisId },
    });

    if (!analysis || analysis.procedureCaseId !== caseId) {
      throw new NotFoundException('Không tìm thấy kết quả rà soát AI.');
    }

    const updated = await this.prisma.procedureAiAnalysis.update({
      where: { id: analysisId },
      data: {
        status: 'ACCEPTED',
        reviewedById: effectiveUserId,
        reviewedAt: new Date(),
      },
    });

    if (options?.saveToNote) {
      const payload: any = analysis.outputPayload || {};
      const noteContent = `[Ghi chú rà soát AI – Cấp GCN lần đầu]\n- Tóm tắt: ${payload.summary || ''}\n- Khuyến nghị: ${(payload.recommendations || []).join('; ')}\n- Nội dung cần xác minh: ${(payload.originAndUseHistoryReview?.issuesToVerify || []).join('; ')}`;
      await this.prisma.procedureNote.create({
        data: {
          procedureCaseId: caseId,
          userId: effectiveUserId,
          content: noteContent,
          noteType: 'OFFICER_REVIEW',
        },
      });
    }

    if (options?.applyChecklist) {
      const payload: any = analysis.outputPayload || {};
      const items = Array.isArray(payload.officerChecklist) ? payload.officerChecklist : [];
      for (const title of items) {
        await this.prisma.procedureChecklistItem.create({
          data: {
            procedureCaseId: caseId,
            checklistGroup: 'CAP_GCN_LAN_DAU',
            title,
            priority: 'MEDIUM',
            isAiSuggested: true,
          },
        });
      }
    }

    await this.prisma.procedureAuditLog.create({
      data: {
        procedureCaseId: caseId,
        userId: effectiveUserId,
        actionType: 'ACCEPT_AI_ANALYSIS',
        entityType: 'ProcedureAiAnalysis',
        entityId: analysisId,
        inputPayload: options || {},
        outputPayload: { status: 'ACCEPTED' },
      },
    });

    return updated;
  }

  async rejectAnalysis(caseId: string, analysisId: string, userId?: string) {
    const effectiveUserId = await this.resolveUserId(userId);

    const analysis = await this.prisma.procedureAiAnalysis.findUnique({
      where: { id: analysisId },
    });

    if (!analysis || analysis.procedureCaseId !== caseId) {
      throw new NotFoundException('Không tìm thấy kết quả rà soát AI.');
    }

    const updated = await this.prisma.procedureAiAnalysis.update({
      where: { id: analysisId },
      data: {
        status: 'REJECTED',
        reviewedById: effectiveUserId,
        reviewedAt: new Date(),
      },
    });

    await this.prisma.procedureAuditLog.create({
      data: {
        procedureCaseId: caseId,
        userId: effectiveUserId,
        actionType: 'REJECT_AI_ANALYSIS',
        entityType: 'ProcedureAiAnalysis',
        entityId: analysisId,
        inputPayload: {},
        outputPayload: { status: 'REJECTED' },
      },
    });

    return updated;
  }

  async exportReviewDocx(caseId: string, analysisId: string, userId?: string) {
    const effectiveUserId = await this.resolveUserId(userId);

    const analysis = await this.prisma.procedureAiAnalysis.findUnique({
      where: { id: analysisId },
      include: {
        procedureCase: {
          include: {
            procedureType: true,
            assignedTo: true,
            documents: true,
            checklistItems: true,
            procedureNotes: true,
          },
        },
      },
    });

    if (!analysis || analysis.procedureCaseId !== caseId) {
      throw new NotFoundException('Không tìm thấy kết quả rà soát AI.');
    }

    if (analysis.analysisType !== 'LAND_FIRST_CERTIFICATE_REVIEW') {
      throw new BadRequestException('Chức năng xuất phiếu rà soát chỉ áp dụng cho kết quả rà soát cấp GCN lần đầu.');
    }

    const procType = analysis.procedureCase?.procedureType;
    if (!procType || (procType.code !== 'LAND_FIRST_CERTIFICATE' && procType.group !== 'CAP_GCN_LAN_DAU')) {
      throw new BadRequestException('Hồ sơ không thuộc thủ tục Cấp GCN lần đầu.');
    }

    const doc = buildLandFirstCertReviewDocx(analysis.procedureCase, analysis, getAgencyConfig());
    const buffer = await Packer.toBuffer(doc);

    const filename = `phieu-ra-soat-cap-gcn-lan-dau-${analysis.procedureCase.caseCode || caseId}.docx`;

    await this.prisma.procedureAuditLog.create({
      data: {
        procedureCaseId: caseId,
        userId: effectiveUserId,
        actionType: 'EXPORT_REVIEW_DOCX',
        entityType: 'ProcedureAiAnalysis',
        entityId: analysisId,
        inputPayload: { analysisType: analysis.analysisType },
        outputPayload: { filename },
      },
    });

    return { buffer, filename };
  }

  async getReviewPreviewData(caseId: string, analysisId: string, userId?: string) {
    const effectiveUserId = await this.resolveUserId(userId);

    const analysis = await this.prisma.procedureAiAnalysis.findUnique({
      where: { id: analysisId },
      include: {
        procedureCase: {
          include: {
            procedureType: true,
            assignedTo: true,
            documents: true,
            checklistItems: true,
            procedureNotes: true,
          },
        },
      },
    });

    if (!analysis || analysis.procedureCaseId !== caseId) {
      throw new NotFoundException('Không tìm thấy kết quả rà soát AI.');
    }

    if (analysis.analysisType !== 'LAND_FIRST_CERTIFICATE_REVIEW') {
      throw new BadRequestException('Chức năng xuất phiếu rà soát chỉ áp dụng cho kết quả rà soát cấp GCN lần đầu.');
    }

    const procType = analysis.procedureCase?.procedureType;
    if (!procType || (procType.code !== 'LAND_FIRST_CERTIFICATE' && procType.group !== 'CAP_GCN_LAN_DAU')) {
      throw new BadRequestException('Hồ sơ không thuộc thủ tục Cấp GCN lần đầu.');
    }

    const config = getAgencyConfig();

    await this.prisma.procedureAuditLog.create({
      data: {
        procedureCaseId: caseId,
        userId: effectiveUserId,
        actionType: 'REVIEW_PREVIEW_DATA',
        entityType: 'ProcedureAiAnalysis',
        entityId: analysisId,
        inputPayload: { analysisType: analysis.analysisType },
        outputPayload: { previewType: 'A4_BROWSER_PRINT' },
      },
    });

    return {
      caseCode: analysis.procedureCase.caseCode || caseId,
      procedureName: analysis.procedureCase.procedureType?.name || 'Cấp GCN quyền sử dụng đất lần đầu',
      applicantName: analysis.procedureCase.applicantName || '[Cán bộ bổ sung/kiểm tra]',
      applicantAddress: analysis.procedureCase.applicantAddress || '[Cán bộ bổ sung/kiểm tra]',
      applicantPhone: analysis.procedureCase.applicantPhone || '[Cán bộ bổ sung/kiểm tra]',
      receivedAt: analysis.procedureCase.receivedAt
        ? new Date(analysis.procedureCase.receivedAt).toLocaleDateString('vi-VN')
        : '[Cán bộ bổ sung/kiểm tra]',
      dueDate: analysis.procedureCase.dueDate
        ? new Date(analysis.procedureCase.dueDate).toLocaleDateString('vi-VN')
        : '[Cán bộ bổ sung/kiểm tra]',
      assignedToName: analysis.procedureCase.assignedTo?.fullName || '[Cán bộ bổ sung/kiểm tra]',
      createdAt: new Date(analysis.createdAt).toLocaleString('vi-VN'),
      confidenceLevel: analysis.confidenceLevel || 'MEDIUM',
      outputPayload: analysis.outputPayload || {},
      agencyConfig: config,
      warningBanner: '⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA',
      warningDisclaimer:
        'Phiếu này là tài liệu hỗ trợ rà soát nội bộ, không phải văn bản kết luận, không thay thế ý kiến thẩm tra của cán bộ chuyên môn và không phải văn bản phát hành cho công dân.',
      officerResponsibility:
        'Cán bộ chuyên môn có trách nhiệm kiểm tra, đối chiếu hồ sơ gốc, căn cứ pháp luật, dữ liệu địa chính, quy hoạch/kế hoạch sử dụng đất và quy trình nội bộ trước khi tham mưu xử lý.',
    };
  }
}
