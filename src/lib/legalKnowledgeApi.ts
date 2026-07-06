import { apiClient } from './apiClient';
import type {
  LegalDocument,
  ProcedureTypeVersion,
  AiPromptVersion,
  ChecklistVersion,
  LegalUpdateLog,
  ProcedureAiAnalysisLegalSnapshot,
} from '../types/legalKnowledge';

export const legalKnowledgeApi = {
  getDocuments: () => apiClient.get<LegalDocument[]>('/legal-knowledge/documents'),
  getDocumentById: (id: string) => apiClient.get<LegalDocument>(`/legal-knowledge/documents/${id}`),
  getProcedureTypeVersions: () => apiClient.get<ProcedureTypeVersion[]>('/legal-knowledge/procedure-type-versions'),
  getPromptVersions: () => apiClient.get<AiPromptVersion[]>('/legal-knowledge/prompt-versions'),
  getChecklistVersions: () => apiClient.get<ChecklistVersion[]>('/legal-knowledge/checklist-versions'),
  getUpdateLogs: () => apiClient.get<LegalUpdateLog[]>('/legal-knowledge/update-logs'),
  getUpdateLogById: (id: string) => apiClient.get<LegalUpdateLog>(`/legal-knowledge/update-logs/${id}`),
  getSnapshots: () => apiClient.get<ProcedureAiAnalysisLegalSnapshot[]>('/legal-knowledge/snapshots'),
  analyzeImpactFromLog: (data: { sourceDocumentId?: string; title?: string; notes?: string }) =>
    apiClient.post<any>('/legal-knowledge/update-logs/analyze-impact', data),
  analyzeImpactFromDoc: (id: string, data?: { title?: string; notes?: string }) =>
    apiClient.post<any>(`/legal-knowledge/documents/${id}/analyze-impact`, data || {}),
  startReview: (id: string, data?: { note?: string; reason?: string }) =>
    apiClient.post<any>(`/legal-knowledge/update-logs/${id}/start-review`, data || {}),
  addReviewNote: (id: string, data?: { note?: string; reason?: string }) =>
    apiClient.post<any>(`/legal-knowledge/update-logs/${id}/add-review-note`, data || {}),
  requestMoreInfo: (id: string, data?: { note?: string; reason?: string }) =>
    apiClient.post<any>(`/legal-knowledge/update-logs/${id}/request-more-info`, data || {}),
  approveForVersioning: (id: string, data?: { note?: string; reason?: string }) =>
    apiClient.post<any>(`/legal-knowledge/update-logs/${id}/approve-for-versioning`, data || {}),
  rejectUpdate: (id: string, data?: { note?: string; reason?: string }) =>
    apiClient.post<any>(`/legal-knowledge/update-logs/${id}/reject`, data || {}),
  closeUpdate: (id: string, data?: { note?: string; reason?: string }) =>
    apiClient.post<any>(`/legal-knowledge/update-logs/${id}/close`, data || {}),
  workflowAction: (id: string, data: { action: string; note?: string; reason?: string }) =>
    apiClient.post<any>(`/legal-knowledge/update-logs/${id}/workflow-action`, data),
  createDraftVersion: (id: string, data: { draftType: string; sourceVersionId: string; reason: string; draftVersion?: string }) =>
    apiClient.post<any>(`/legal-knowledge/update-logs/${id}/create-draft-version`, data),
  getSampleCases: () => apiClient.get<any[]>('/legal-knowledge/sample-cases'),
  runDraftSimulation: (id: string, data: { procedureCaseId: string; draftProcedureTypeVersionId?: string; draftPromptVersionId?: string; draftChecklistVersionId?: string; note?: string }) =>
    apiClient.post<any>(`/legal-knowledge/update-logs/${id}/run-draft-simulation`, data),
  activateDraftVersion: (id: string, data: { draftType: string; draftVersionId: string; reason: string; effectiveFrom: string; confirmationText: string }) =>
    apiClient.post<any>(`/legal-knowledge/update-logs/${id}/activate-draft-version`, data),
  getActivationVerification: (id: string) =>
    apiClient.get<any>(`/legal-knowledge/update-logs/${id}/activation-verification`),
  rollbackVersion: (
    updateLogId: string,
    payload: {
      rollbackReason: string;
      confirmationText: string;
      targetVersionId?: string;
    },
  ) => apiClient.post<any>(`/legal-knowledge/update-logs/${updateLogId}/rollback-version`, payload),
};



