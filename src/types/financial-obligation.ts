export type FinancialObligationAssessmentStatus =
  | 'NOT_STARTED'
  | 'MISSING_INFORMATION'
  | 'READY_FOR_REVIEW'
  | 'ESTIMATED'
  | 'WAITING_FOR_TAX_NOTICE'
  | 'TAX_NOTICE_RECEIVED'
  | 'WAITING_FOR_PAYMENT'
  | 'PAYMENT_UPLOADED'
  | 'OFFICER_VERIFIED'
  | 'MANAGER_VERIFIED'
  | 'COMPLETED'
  | 'BLOCKED'
  | 'NOT_APPLICABLE';

export type FinancialObligationAssessmentMode = 'MANUAL' | 'AI_ASSISTED' | 'IMPORTED_TAX_NOTICE';

export type TaxNoticeStatus = 'NONE' | 'AWAITING' | 'RECEIVED' | 'VERIFIED' | 'DISCREPANCY_DETECTED';

export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID_FULL' | 'VERIFIED';

export type OfficerReviewStatus = 'UNVERIFIED' | 'OFFICER_VERIFIED' | 'REJECTED_NEEDS_INFO';

export type ManagerReviewStatus = 'NOT_REQUIRED' | 'PENDING' | 'MANAGER_VERIFIED' | 'REJECTED_TO_OFFICER';

export type FinancialRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type FinancialObligationItemType =
  | 'LAND_USE_FEE'
  | 'DIFFERENTIAL_LAND_USE_FEE'
  | 'LAND_RENTAL_FEE'
  | 'REGISTRATION_FEE'
  | 'PERSONAL_INCOME_TAX'
  | 'APPRAISAL_FEE'
  | 'ISSUANCE_FEE'
  | 'CADASTRAL_FEE'
  | 'OTHER_FEE';

export type FinancialAuditAction =
  | 'ASSESSMENT_CREATED'
  | 'ASSESSMENT_UPDATED'
  | 'AI_SUGGESTION_GENERATED'
  | 'ITEM_CREATED'
  | 'ITEM_UPDATED'
  | 'OFFICER_EDITED'
  | 'OFFICER_CONFIRMED'
  | 'TAX_NOTICE_UPLOADED'
  | 'PAYMENT_EVIDENCE_UPLOADED'
  | 'OFFICER_VERIFIED'
  | 'MANAGER_VERIFIED'
  | 'STATUS_CHANGED'
  | 'EXPORT_GENERATED'
  | 'COMPLETED'
  | 'COMPLETION_BLOCKED';

export interface FinancialObligationItem {
  id: string;
  assessmentId: string;
  itemType: FinancialObligationItemType;
  itemLabel: string;
  estimatedAmount: number | string;
  officialAmount?: number | string | null;
  calculationBasis?: string | null;
  legalBasis?: string | null;
  dataSource: string;
  confidenceLevel: number;
  isOfficial: boolean;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaxNoticeRecord {
  id: string;
  assessmentId: string;
  noticeNumber: string;
  issuingAuthority: string;
  issueDate: string;
  receivedDate: string;
  totalAmount: number | string;
  fileAttachmentId: string;
  verifiedById?: string | null;
  verifiedAt?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentEvidenceRecord {
  id: string;
  assessmentId: string;
  paymentDate: string;
  amountPaid: number | string;
  payerName: string;
  receiptNumber: string;
  treasuryOrBank: string;
  fileAttachmentId: string;
  verifiedById?: string | null;
  verifiedAt?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialObligationAuditLog {
  id: string;
  assessmentId: string;
  actorId: string;
  action: FinancialAuditAction;
  beforeValue?: string | null;
  afterValue?: string | null;
  reason?: string | null;
  createdAt: string;
  actor?: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}

export interface FinancialObligationAssessment {
  id: string;
  caseId: string;
  procedureType: string;
  assessmentStatus: FinancialObligationAssessmentStatus;
  assessmentMode: FinancialObligationAssessmentMode;
  estimatedTotalAmount: number | string;
  officialTotalAmount?: number | string | null;
  currency: string;
  isEstimate: boolean;
  taxNoticeStatus: TaxNoticeStatus;
  paymentStatus: PaymentStatus;
  officerReviewStatus: OfficerReviewStatus;
  managerReviewStatus: ManagerReviewStatus;
  riskLevel: FinancialRiskLevel;
  warningText?: string | null;
  createdById: string;
  reviewedById?: string | null;
  approvedById?: string | null;
  createdAt: string;
  updatedAt: string;
  items: FinancialObligationItem[];
  taxNotice?: TaxNoticeRecord | null;
  paymentEvidences: PaymentEvidenceRecord[];
}

export interface FinancialObligationResponse {
  success: boolean;
  data: FinancialObligationAssessment | null;
  message?: string;
  safetyWarnings?: string[];
}

export interface FinancialObligationAuditResponse {
  success: boolean;
  data: FinancialObligationAuditLog[];
}
