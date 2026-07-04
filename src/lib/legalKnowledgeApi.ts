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
};

