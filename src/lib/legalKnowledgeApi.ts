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
  getSnapshots: () => apiClient.get<ProcedureAiAnalysisLegalSnapshot[]>('/legal-knowledge/snapshots'),
};
