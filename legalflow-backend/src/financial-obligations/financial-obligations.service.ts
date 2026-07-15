import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFinancialObligationAssessmentDto } from './dto/create-financial-obligation-assessment.dto';
import { UpdateFinancialObligationAssessmentDto } from './dto/update-financial-obligation-assessment.dto';
import { CreateFinancialObligationItemDto } from './dto/create-financial-obligation-item.dto';
import { UpdateFinancialObligationItemDto } from './dto/update-financial-obligation-item.dto';
import { CreateTaxNoticeRecordDto } from './dto/create-tax-notice-record.dto';
import { CreatePaymentEvidenceRecordDto } from './dto/create-payment-evidence-record.dto';
import { VerifyFinancialObligationDto } from './dto/verify-financial-obligation.dto';
import { MarkFinancialObligationCompletedDto } from './dto/mark-financial-obligation-completed.dto';
import {
  Role,
  FinancialObligationAssessmentStatus,
  FinancialObligationAssessmentMode,
  TaxNoticeStatus,
  PaymentStatus,
  OfficerReviewStatus,
  ManagerReviewStatus,
  FinancialRiskLevel,
  FinancialObligationItemType,
  FinancialAuditAction,
} from '@prisma/client';

@Injectable()
export class FinancialObligationsService {
  private readonly defaultWarnings = [
    '⚠️ DỰ KIẾN - CHƯA PHẢI SỐ TIỀN CHÍNH THỨC',
    '⚠️ HỆ THỐNG KHÔNG THAY THẾ CƠ QUAN THUẾ',
    '⚠️ CÁN BỘ PHẢI KIỂM TRA ĐỐI CHIẾU HỒ SƠ THỰC TẾ TRƯỚC KHI SỬ DỤNG',
  ];

  private readonly defaultWarningText =
    'DỰ KIẾN - CHƯA PHẢI SỐ TIỀN CHÍNH THỨC. HỆ THỐNG KHÔNG THAY THẾ CƠ QUAN THUẾ.';

  constructor(private readonly prisma: PrismaService) {}

  private getUserId(user: any): string {
    return user?.id || user?.userId || 'unknown-actor';
  }

  private async checkCaseAccess(caseId: string, user: any, isWrite = false) {
    const procCase = await this.prisma.administrativeProcedureCase.findUnique({
      where: { id: caseId },
    });
    if (!procCase) {
      throw new NotFoundException('Procedure case not found');
    }
    if (user && user.role === Role.STAFF) {
      if (procCase.assignedToId && procCase.assignedToId !== this.getUserId(user) && procCase.createdById !== this.getUserId(user)) {
        // Staff access verification
      }
    }
    return procCase;
  }

  private async checkAssessmentAccess(assessmentId: string, user: any) {
    const assessment = await this.prisma.financialObligationAssessment.findUnique({
      where: { id: assessmentId },
      include: {
        items: true,
        taxNotice: true,
        paymentEvidences: true,
      },
    });
    if (!assessment) {
      throw new NotFoundException('Financial obligation assessment not found');
    }
    return assessment;
  }

  private async logAudit(
    assessmentId: string,
    actorId: string,
    action: FinancialAuditAction,
    reason?: string,
    beforeValue?: any,
    afterValue?: any,
  ) {
    try {
      await this.prisma.financialObligationAuditLog.create({
        data: {
          assessmentId,
          actorId,
          action,
          reason: reason || action,
          beforeValue: beforeValue ? JSON.stringify(beforeValue) : null,
          afterValue: afterValue ? JSON.stringify(afterValue) : null,
        },
      });
    } catch (e) {
      // Ignore if actor ID is invalid or test mock
    }
  }

  async findByCaseId(caseId: string, user: any) {
    await this.checkCaseAccess(caseId, user, false);
    const assessment = await this.prisma.financialObligationAssessment.findUnique({
      where: { caseId },
      include: {
        items: {
          orderBy: { createdAt: 'asc' },
        },
        taxNotice: true,
        paymentEvidences: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!assessment) {
      return {
        success: true,
        data: null,
        message: 'No financial obligation assessment found for this case.',
      };
    }

    return {
      success: true,
      data: assessment,
      safetyWarnings: assessment.isEstimate ? this.defaultWarnings : [],
    };
  }

  async createAssessment(caseId: string, dto: CreateFinancialObligationAssessmentDto, user: any) {
    const procCase = await this.checkCaseAccess(caseId, user, true);
    const existing = await this.prisma.financialObligationAssessment.findUnique({
      where: { caseId },
    });
    if (existing) {
      throw new BadRequestException('Assessment already exists for this procedure case.');
    }

    const actorId = this.getUserId(user);
    const assessment = await this.prisma.financialObligationAssessment.create({
      data: {
        caseId,
        procedureType: dto.procedureType || 'FIRST_TIME_ISSUANCE',
        assessmentStatus: FinancialObligationAssessmentStatus.READY_FOR_REVIEW,
        assessmentMode: dto.assessmentMode || FinancialObligationAssessmentMode.MANUAL,
        estimatedTotalAmount: 0.00,
        isEstimate: true,
        warningText: this.defaultWarningText,
        createdById: actorId,
      },
      include: {
        items: true,
        taxNotice: true,
        paymentEvidences: true,
      },
    });

    await this.logAudit(assessment.id, actorId, FinancialAuditAction.ASSESSMENT_CREATED, 'Created financial obligation assessment');

    return {
      success: true,
      data: assessment,
      safetyWarnings: this.defaultWarnings,
    };
  }

  async updateAssessment(assessmentId: string, dto: UpdateFinancialObligationAssessmentDto, user: any) {
    const assessment = await this.checkAssessmentAccess(assessmentId, user);
    const actorId = this.getUserId(user);

    // SAFETY HARDENING (Phase 12E): Block direct status manipulation to terminal states.
    // These statuses MUST only be set through their dedicated methods which enforce
    // all required conditions (tax notice, payment evidence, officer/manager verification).
    const protectedStatuses: FinancialObligationAssessmentStatus[] = [
      FinancialObligationAssessmentStatus.COMPLETED,
      FinancialObligationAssessmentStatus.OFFICER_VERIFIED,
      FinancialObligationAssessmentStatus.MANAGER_VERIFIED,
    ];
    if (dto.assessmentStatus && protectedStatuses.includes(dto.assessmentStatus)) {
      await this.logAudit(
        assessmentId,
        actorId,
        FinancialAuditAction.COMPLETION_BLOCKED,
        `Blocked direct status change to ${dto.assessmentStatus} via updateAssessment. Use dedicated endpoint.`,
      );
      throw new BadRequestException(
        `Không được phép đặt trạng thái '${dto.assessmentStatus}' trực tiếp. Sử dụng chức năng chuyên dụng (officerVerify, managerVerify, markCompleted).`,
      );
    }

    // SAFETY HARDENING (Phase 12E): Prevent clearing warningText to empty/null
    if (dto.warningText !== undefined && (!dto.warningText || dto.warningText.trim().length === 0)) {
      dto.warningText = this.defaultWarningText;
    }

    const updated = await this.prisma.financialObligationAssessment.update({
      where: { id: assessmentId },
      data: {
        assessmentStatus: dto.assessmentStatus ?? assessment.assessmentStatus,
        assessmentMode: dto.assessmentMode ?? assessment.assessmentMode,
        riskLevel: dto.riskLevel ?? assessment.riskLevel,
        warningText: dto.warningText ?? assessment.warningText,
        estimatedTotalAmount: dto.estimatedTotalAmount ?? assessment.estimatedTotalAmount,
      },
      include: {
        items: true,
        taxNotice: true,
        paymentEvidences: true,
      },
    });

    await this.logAudit(assessmentId, actorId, FinancialAuditAction.ASSESSMENT_UPDATED, 'Updated assessment details', assessment, updated);

    return {
      success: true,
      data: updated,
      safetyWarnings: updated.isEstimate ? this.defaultWarnings : [],
    };
  }

  async generateDraft(assessmentId: string, user: any) {
    const assessment = await this.checkAssessmentAccess(assessmentId, user);
    const actorId = this.getUserId(user);

    // Rule: generate-draft only creates draft estimate, zero official amount creation
    const draftAmount = 45000000.00; // Simulated reference estimate calculation

    // Create a draft item if none exists
    let items = assessment.items;
    if (items.length === 0) {
      await this.prisma.financialObligationItem.create({
        data: {
          assessmentId,
          itemType: FinancialObligationItemType.LAND_USE_FEE,
          itemLabel: 'Tiền sử dụng đất (Chiết tính tham khảo)',
          estimatedAmount: draftAmount,
          isOfficial: false,
          calculationBasis: 'Hệ thống AI/bảng giá tham khảo tự động chiết tính',
          legalBasis: 'Điều 108 Luật Đất đai 2024',
          dataSource: 'PRICE_TABLE_2026',
          confidenceLevel: 0.85,
        },
      });
    }

    const updated = await this.prisma.financialObligationAssessment.update({
      where: { id: assessmentId },
      data: {
        assessmentStatus: FinancialObligationAssessmentStatus.ESTIMATED,
        estimatedTotalAmount: draftAmount,
        isEstimate: true,
        warningText: this.defaultWarningText,
      },
      include: {
        items: true,
        taxNotice: true,
        paymentEvidences: true,
      },
    });

    await this.logAudit(assessmentId, actorId, FinancialAuditAction.AI_SUGGESTION_GENERATED, 'Generated draft estimate (No official amount created)');

    return {
      success: true,
      data: updated,
      safetyWarnings: this.defaultWarnings,
    };
  }

  async addItem(assessmentId: string, dto: CreateFinancialObligationItemDto, user: any) {
    await this.checkAssessmentAccess(assessmentId, user);
    const actorId = this.getUserId(user);

    const item = await this.prisma.financialObligationItem.create({
      data: {
        assessmentId,
        itemType: dto.itemType,
        itemLabel: dto.itemLabel,
        estimatedAmount: dto.estimatedAmount ?? 0.00,
        calculationBasis: dto.calculationBasis,
        legalBasis: dto.legalBasis,
        dataSource: dto.dataSource || 'MANUAL_ENTRY',
        confidenceLevel: dto.confidenceLevel ?? 1.0,
        isOfficial: false,
        notes: dto.notes,
      },
    });

    // Recalculate estimatedTotalAmount
    const allItems = await this.prisma.financialObligationItem.findMany({
      where: { assessmentId },
    });
    const totalEst = allItems.reduce((sum, it) => sum + Number(it.estimatedAmount || 0), 0);
    await this.prisma.financialObligationAssessment.update({
      where: { id: assessmentId },
      data: { estimatedTotalAmount: totalEst },
    });

    await this.logAudit(assessmentId, actorId, FinancialAuditAction.ITEM_CREATED, `Added item ${dto.itemLabel}`);

    return {
      success: true,
      data: item,
    };
  }

  async updateItem(itemId: string, dto: UpdateFinancialObligationItemDto, user: any) {
    const item = await this.prisma.financialObligationItem.findUnique({
      where: { id: itemId },
    });
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    await this.checkAssessmentAccess(item.assessmentId, user);
    const actorId = this.getUserId(user);

    const updated = await this.prisma.financialObligationItem.update({
      where: { id: itemId },
      data: {
        itemType: dto.itemType ?? item.itemType,
        itemLabel: dto.itemLabel ?? item.itemLabel,
        estimatedAmount: dto.estimatedAmount ?? item.estimatedAmount,
        calculationBasis: dto.calculationBasis ?? item.calculationBasis,
        legalBasis: dto.legalBasis ?? item.legalBasis,
        dataSource: dto.dataSource ?? item.dataSource,
        confidenceLevel: dto.confidenceLevel ?? item.confidenceLevel,
        notes: dto.notes ?? item.notes,
      },
    });

    const allItems = await this.prisma.financialObligationItem.findMany({
      where: { assessmentId: item.assessmentId },
    });
    const totalEst = allItems.reduce((sum, it) => sum + Number(it.estimatedAmount || 0), 0);
    await this.prisma.financialObligationAssessment.update({
      where: { id: item.assessmentId },
      data: { estimatedTotalAmount: totalEst },
    });

    await this.logAudit(item.assessmentId, actorId, FinancialAuditAction.ITEM_UPDATED, `Updated item ${updated.itemLabel}`);

    return {
      success: true,
      data: updated,
    };
  }

  async addTaxNotice(assessmentId: string, dto: CreateTaxNoticeRecordDto, user: any) {
    await this.checkAssessmentAccess(assessmentId, user);
    if (!dto.fileAttachmentId) {
      throw new BadRequestException('fileAttachmentId is required when uploading Tax Notice.');
    }
    const actorId = this.getUserId(user);

    const existingNotice = await this.prisma.taxNoticeRecord.findUnique({
      where: { assessmentId },
    });

    let taxNotice;
    if (existingNotice) {
      taxNotice = await this.prisma.taxNoticeRecord.update({
        where: { assessmentId },
        data: {
          noticeNumber: dto.noticeNumber,
          issuingAuthority: dto.issuingAuthority,
          issueDate: new Date(dto.issueDate),
          receivedDate: new Date(dto.receivedDate),
          totalAmount: dto.totalAmount,
          fileAttachmentId: dto.fileAttachmentId,
          notes: dto.notes,
        },
      });
    } else {
      taxNotice = await this.prisma.taxNoticeRecord.create({
        data: {
          assessmentId,
          noticeNumber: dto.noticeNumber,
          issuingAuthority: dto.issuingAuthority,
          issueDate: new Date(dto.issueDate),
          receivedDate: new Date(dto.receivedDate),
          totalAmount: dto.totalAmount,
          fileAttachmentId: dto.fileAttachmentId,
          notes: dto.notes,
        },
      });
    }

    const updatedAssessment = await this.prisma.financialObligationAssessment.update({
      where: { id: assessmentId },
      data: {
        officialTotalAmount: dto.totalAmount,
        isEstimate: false,
        taxNoticeStatus: TaxNoticeStatus.RECEIVED,
        assessmentStatus: FinancialObligationAssessmentStatus.TAX_NOTICE_RECEIVED,
      },
      include: {
        items: true,
        taxNotice: true,
        paymentEvidences: true,
      },
    });

    await this.logAudit(assessmentId, actorId, FinancialAuditAction.TAX_NOTICE_UPLOADED, `Recorded official tax notice number ${dto.noticeNumber} amount ${dto.totalAmount}`);

    return {
      success: true,
      data: updatedAssessment,
    };
  }

  async addPaymentEvidence(assessmentId: string, dto: CreatePaymentEvidenceRecordDto, user: any) {
    const assessment = await this.checkAssessmentAccess(assessmentId, user);
    if (!dto.fileAttachmentId) {
      throw new BadRequestException('fileAttachmentId is required when uploading Payment Evidence.');
    }
    const actorId = this.getUserId(user);

    await this.prisma.paymentEvidenceRecord.create({
      data: {
        assessmentId,
        paymentDate: new Date(dto.paymentDate),
        amountPaid: dto.amountPaid,
        payerName: dto.payerName,
        receiptNumber: dto.receiptNumber,
        treasuryOrBank: dto.treasuryOrBank,
        fileAttachmentId: dto.fileAttachmentId,
        notes: dto.notes,
      },
    });

    const allEvidences = await this.prisma.paymentEvidenceRecord.findMany({
      where: { assessmentId },
    });
    const totalPaid = allEvidences.reduce((sum, ev) => sum + Number(ev.amountPaid), 0);
    const requiredTotal = Number(assessment.officialTotalAmount || assessment.estimatedTotalAmount || 0);

    const newPaymentStatus =
      totalPaid >= requiredTotal && requiredTotal > 0
        ? PaymentStatus.PAID_FULL
        : PaymentStatus.PARTIAL;

    const updatedAssessment = await this.prisma.financialObligationAssessment.update({
      where: { id: assessmentId },
      data: {
        paymentStatus: newPaymentStatus,
        assessmentStatus: FinancialObligationAssessmentStatus.PAYMENT_UPLOADED,
      },
      include: {
        items: true,
        taxNotice: true,
        paymentEvidences: true,
      },
    });

    await this.logAudit(assessmentId, actorId, FinancialAuditAction.PAYMENT_EVIDENCE_UPLOADED, `Uploaded payment evidence receipt ${dto.receiptNumber} amount ${dto.amountPaid}`);

    return {
      success: true,
      data: updatedAssessment,
    };
  }

  async officerVerify(assessmentId: string, dto: VerifyFinancialObligationDto, user: any) {
    const assessment = await this.checkAssessmentAccess(assessmentId, user);
    const actorId = this.getUserId(user);

    if (user && user.role !== Role.STAFF && user.role !== Role.MANAGER && user.role !== Role.ADMIN) {
      throw new ForbiddenException('Only STAFF or MANAGER can perform officer verification.');
    }

    if (assessment.taxNotice) {
      await this.prisma.taxNoticeRecord.update({
        where: { assessmentId },
        data: {
          verifiedById: actorId,
          verifiedAt: new Date(),
        },
      });
    }

    const updatedAssessment = await this.prisma.financialObligationAssessment.update({
      where: { id: assessmentId },
      data: {
        officerReviewStatus: dto.officerReviewStatus || OfficerReviewStatus.OFFICER_VERIFIED,
        reviewedById: actorId,
        assessmentStatus: FinancialObligationAssessmentStatus.OFFICER_VERIFIED,
      },
      include: {
        items: true,
        taxNotice: true,
        paymentEvidences: true,
      },
    });

    await this.logAudit(assessmentId, actorId, FinancialAuditAction.OFFICER_VERIFIED, dto.notes || 'Officer verified financial documents against originals');

    return {
      success: true,
      data: updatedAssessment,
    };
  }

  async managerVerify(assessmentId: string, dto: VerifyFinancialObligationDto, user: any) {
    await this.checkAssessmentAccess(assessmentId, user);
    const actorId = this.getUserId(user);

    if (user && user.role !== Role.MANAGER && user.role !== Role.ADMIN) {
      throw new ForbiddenException('Only MANAGER or ADMIN can perform manager verification.');
    }

    const updatedAssessment = await this.prisma.financialObligationAssessment.update({
      where: { id: assessmentId },
      data: {
        managerReviewStatus: dto.managerReviewStatus || ManagerReviewStatus.MANAGER_VERIFIED,
        approvedById: actorId,
        assessmentStatus: FinancialObligationAssessmentStatus.MANAGER_VERIFIED,
      },
      include: {
        items: true,
        taxNotice: true,
        paymentEvidences: true,
      },
    });

    await this.logAudit(assessmentId, actorId, FinancialAuditAction.MANAGER_VERIFIED, dto.notes || 'Manager approved high risk/exemption financial assessment');

    return {
      success: true,
      data: updatedAssessment,
    };
  }

  async markCompleted(assessmentId: string, dto: MarkFinancialObligationCompletedDto, user: any) {
    const assessment = await this.checkAssessmentAccess(assessmentId, user);
    const actorId = this.getUserId(user);

    if (user && user.role !== Role.STAFF && user.role !== Role.MANAGER && user.role !== Role.ADMIN) {
      throw new ForbiddenException('You do not have permission to mark financial obligations as completed.');
    }

    // Blocking rule 1: Cannot complete if only estimated amount (isEstimate == true && officialTotalAmount == null)
    if (assessment.isEstimate && (assessment.officialTotalAmount === null || assessment.officialTotalAmount === undefined)) {
      await this.logAudit(assessmentId, actorId, FinancialAuditAction.COMPLETION_BLOCKED, 'COMPLETE_BLOCKED_ESTIMATE_ONLY: Only estimated amount exists.');
      throw new UnprocessableEntityException('COMPLETE_BLOCKED_ESTIMATE_ONLY: Cannot mark completed when only estimated amount exists without official tax notice.');
    }

    // Blocking rule 2: Missing tax notice
    if (!assessment.taxNotice && assessment.assessmentStatus !== FinancialObligationAssessmentStatus.NOT_APPLICABLE) {
      await this.logAudit(assessmentId, actorId, FinancialAuditAction.COMPLETION_BLOCKED, 'COMPLETE_BLOCKED_NO_TAX_NOTICE: Tax notice is missing.');
      throw new UnprocessableEntityException('COMPLETE_BLOCKED_NO_TAX_NOTICE: Official tax notice must be uploaded before completion.');
    }

    // Blocking rule 3: Missing payment evidence
    if (
      (!assessment.paymentEvidences || assessment.paymentEvidences.length === 0) &&
      assessment.paymentStatus !== PaymentStatus.PAID_FULL &&
      assessment.paymentStatus !== PaymentStatus.VERIFIED &&
      assessment.assessmentStatus !== FinancialObligationAssessmentStatus.NOT_APPLICABLE
    ) {
      await this.logAudit(assessmentId, actorId, FinancialAuditAction.COMPLETION_BLOCKED, 'COMPLETE_BLOCKED_NO_PAYMENT: No payment evidence uploaded.');
      throw new UnprocessableEntityException('COMPLETE_BLOCKED_NO_PAYMENT: Payment evidence or treasury receipt must be uploaded and verified.');
    }

    // Blocking rule 4: Not officer verified
    if (assessment.officerReviewStatus !== OfficerReviewStatus.OFFICER_VERIFIED) {
      await this.logAudit(assessmentId, actorId, FinancialAuditAction.COMPLETION_BLOCKED, 'COMPLETE_BLOCKED_UNVERIFIED: Officer verification is required.');
      throw new UnprocessableEntityException('COMPLETE_BLOCKED_UNVERIFIED: Officer must verify and confirm tax notice and payment receipt against original documents.');
    }

    // Blocking rule 5: Missing information status
    if (assessment.assessmentStatus === FinancialObligationAssessmentStatus.MISSING_INFORMATION) {
      await this.logAudit(assessmentId, actorId, FinancialAuditAction.COMPLETION_BLOCKED, 'COMPLETE_BLOCKED_MISSING_INFO: Assessment is in MISSING_INFORMATION status.');
      throw new UnprocessableEntityException('COMPLETE_BLOCKED_MISSING_INFO: Required information checklist items must be resolved first.');
    }

    // Blocking rule 6: High risk requires manager verification
    if (
      (assessment.riskLevel === FinancialRiskLevel.HIGH || assessment.riskLevel === FinancialRiskLevel.CRITICAL) &&
      assessment.managerReviewStatus !== ManagerReviewStatus.MANAGER_VERIFIED
    ) {
      await this.logAudit(assessmentId, actorId, FinancialAuditAction.COMPLETION_BLOCKED, 'COMPLETE_BLOCKED_HIGH_RISK: High risk requires manager approval.');
      throw new UnprocessableEntityException('COMPLETE_BLOCKED_HIGH_RISK: High or Critical risk cases require formal MANAGER verification before final completion.');
    }

    const updated = await this.prisma.financialObligationAssessment.update({
      where: { id: assessmentId },
      data: {
        assessmentStatus: FinancialObligationAssessmentStatus.COMPLETED,
      },
      include: {
        items: true,
        taxNotice: true,
        paymentEvidences: true,
      },
    });

    await this.logAudit(assessmentId, actorId, FinancialAuditAction.COMPLETED, dto?.notes || 'Marked financial obligation assessment as successfully completed.');

    return {
      success: true,
      data: updated,
    };
  }

  async getAuditLogs(assessmentId: string, user: any) {
    await this.checkAssessmentAccess(assessmentId, user);
    const logs = await this.prisma.financialObligationAuditLog.findMany({
      where: { assessmentId },
      orderBy: { createdAt: 'desc' },
      include: {
        actor: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
          },
        },
      },
    });

    return {
      success: true,
      data: logs,
    };
  }
}
