import { apiClient } from './apiClient';
import type {
  ProcedureType,
  ProcedureCase,
  ProcedureField,
  ProcedureStatus,
  ProcedureNote,
  ProcedureChecklistItem,
} from '../types/procedure';

export interface QueryProcedureCasesParams {
  field?: ProcedureField;
  procedureTypeId?: string;
  status?: ProcedureStatus;
  keyword?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedProcedureCases {
  data: ProcedureCase[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const procedureCasesApi = {
  getProcedureTypes: () => apiClient.get<ProcedureType[]>('/procedure-types'),

  createCase: (data: Partial<ProcedureCase>) => apiClient.post<ProcedureCase>('/procedure-cases', data),

  getCases: (params: QueryProcedureCasesParams = {}) => {
    const qs = new URLSearchParams();
    if (params.field) qs.set('field', params.field);
    if (params.procedureTypeId) qs.set('procedureTypeId', params.procedureTypeId);
    if (params.status) qs.set('status', params.status);
    if (params.keyword) qs.set('keyword', params.keyword);
    if (params.page) qs.set('page', String(params.page));
    if (params.limit) qs.set('limit', String(params.limit));
    const str = qs.toString();
    return apiClient.get<PaginatedProcedureCases>(`/procedure-cases${str ? `?${str}` : ''}`);
  },

  getCase: (id: string) => apiClient.get<ProcedureCase>(`/procedure-cases/${id}`),

  updateCase: (id: string, data: Partial<ProcedureCase>) =>
    apiClient.patch<ProcedureCase>(`/procedure-cases/${id}`, data),

  addNote: (id: string, data: { content: string; noteType?: string }) =>
    apiClient.post<ProcedureNote>(`/procedure-cases/${id}/notes`, data),

  addChecklist: (id: string, data: { checklistGroup: string; title: string; description?: string }) =>
    apiClient.post<ProcedureChecklistItem>(`/procedure-cases/${id}/checklists`, data),

  updateChecklist: (caseId: string, itemId: string, data: { isCompleted?: boolean; title?: string }) =>
    apiClient.patch<ProcedureChecklistItem>(`/procedure-cases/${caseId}/checklists/${itemId}`, data),
};
