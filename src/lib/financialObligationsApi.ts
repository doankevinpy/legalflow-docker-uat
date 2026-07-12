import { apiClient } from './apiClient';
import type {
  FinancialObligationResponse,
  FinancialObligationAuditResponse,
  FinancialObligationItem,
  FinancialObligationAssessmentStatus,
  FinancialObligationAssessmentMode,
  FinancialRiskLevel,
  FinancialObligationItemType,
  OfficerReviewStatus,
  ManagerReviewStatus,
} from '../types/financial-obligation';

export const financialObligationsApi = {
  getByCaseId: (caseId: string) =>
    apiClient.get<FinancialObligationResponse>(`/procedure-cases/${caseId}/financial-obligations`),

  createAssessment: (caseId: string, data?: { procedureType?: string; assessmentMode?: FinancialObligationAssessmentMode }) =>
    apiClient.post<FinancialObligationResponse>(`/procedure-cases/${caseId}/financial-obligations`, data || {}),

  updateAssessment: (
    assessmentId: string,
    data: {
      assessmentStatus?: FinancialObligationAssessmentStatus;
      assessmentMode?: FinancialObligationAssessmentMode;
      riskLevel?: FinancialRiskLevel;
      warningText?: string;
      estimatedTotalAmount?: number;
    },
  ) => apiClient.patch<FinancialObligationResponse>(`/financial-obligations/${assessmentId}`, data),

  generateDraft: (assessmentId: string) =>
    apiClient.post<FinancialObligationResponse>(`/financial-obligations/${assessmentId}/generate-draft`, {}),

  addItem: (
    assessmentId: string,
    data: {
      itemType: FinancialObligationItemType;
      itemLabel: string;
      estimatedAmount?: number;
      calculationBasis?: string;
      legalBasis?: string;
      dataSource?: string;
      confidenceLevel?: number;
      notes?: string;
    },
  ) => apiClient.post<{ success: boolean; data: FinancialObligationItem }>(`/financial-obligations/${assessmentId}/items`, data),

  updateItem: (
    itemId: string,
    data: {
      itemType?: FinancialObligationItemType;
      itemLabel?: string;
      estimatedAmount?: number;
      calculationBasis?: string;
      legalBasis?: string;
      dataSource?: string;
      confidenceLevel?: number;
      notes?: string;
    },
  ) => apiClient.patch<{ success: boolean; data: FinancialObligationItem }>(`/financial-obligation-items/${itemId}`, data),

  addTaxNotice: (
    assessmentId: string,
    data: {
      noticeNumber: string;
      issuingAuthority: string;
      issueDate: string;
      receivedDate: string;
      totalAmount: number;
      fileAttachmentId: string;
      notes?: string;
    },
  ) => apiClient.post<FinancialObligationResponse>(`/financial-obligations/${assessmentId}/tax-notices`, data),

  addPaymentEvidence: (
    assessmentId: string,
    data: {
      paymentDate: string;
      amountPaid: number;
      payerName: string;
      receiptNumber: string;
      treasuryOrBank: string;
      fileAttachmentId: string;
      notes?: string;
    },
  ) => apiClient.post<FinancialObligationResponse>(`/financial-obligations/${assessmentId}/payment-evidence`, data),

  officerVerify: (
    assessmentId: string,
    data?: {
      officerReviewStatus?: OfficerReviewStatus;
      notes?: string;
    },
  ) => apiClient.post<FinancialObligationResponse>(`/financial-obligations/${assessmentId}/officer-verify`, data || {}),

  managerVerify: (
    assessmentId: string,
    data?: {
      managerReviewStatus?: ManagerReviewStatus;
      notes?: string;
    },
  ) => apiClient.post<FinancialObligationResponse>(`/financial-obligations/${assessmentId}/manager-verify`, data || {}),

  markCompleted: (
    assessmentId: string,
    data?: {
      notes?: string;
      forceCompleted?: boolean;
    },
  ) => apiClient.post<FinancialObligationResponse>(`/financial-obligations/${assessmentId}/mark-completed`, data || {}),

  getAuditLogs: (assessmentId: string) =>
    apiClient.get<FinancialObligationAuditResponse>(`/financial-obligations/${assessmentId}/audit-logs`),
};
