// ============================================================
// casesApi.ts – Wrapper cho tất cả /cases endpoints
// ============================================================

import { apiClient } from './apiClient';
import type {
  ApiCase,
  CaseStats,
  CreateCaseDto,
  PaginatedResponse,
  QueryCasesParams,
  UpdateCaseDto,
} from './api-types';

function buildQuery(params: QueryCasesParams): string {
  const qs = new URLSearchParams();
  if (params.search)        qs.set('search', params.search);
  if (params.status)        qs.set('status', params.status);
  if (params.type)          qs.set('type', params.type);
  if (params.field)         qs.set('field', params.field);
  if (params.neighborhood)  qs.set('neighborhood', params.neighborhood);
  if (params.assignedToId)  qs.set('assignedToId', params.assignedToId);
  if (params.page)          qs.set('page', String(params.page));
  if (params.limit)         qs.set('limit', String(params.limit));
  if (params.sortBy)        qs.set('sortBy', params.sortBy);
  if (params.sortOrder)     qs.set('sortOrder', params.sortOrder);
  const str = qs.toString();
  return str ? `?${str}` : '';
}

export const casesApi = {
  /** GET /cases */
  getCases: (params: QueryCasesParams = {}) =>
    apiClient.get<PaginatedResponse<ApiCase>>(`/cases${buildQuery(params)}`),

  /** GET /cases/stats */
  getStats: () =>
    apiClient.get<CaseStats>('/cases/stats'),

  /** GET /cases/:id */
  getCase: (id: string) =>
    apiClient.get<ApiCase>(`/cases/${id}`),

  /** POST /cases */
  createCase: (dto: CreateCaseDto) =>
    apiClient.post<ApiCase>('/cases', dto),

  /** PATCH /cases/:id */
  updateCase: (id: string, dto: UpdateCaseDto) =>
    apiClient.patch<ApiCase>(`/cases/${id}`, dto),

  /** DELETE /cases/:id (soft delete) */
  deleteCase: (id: string) =>
    apiClient.delete<void>(`/cases/${id}`),

  /** PATCH /cases/:id/status */
  changeStatus: (id: string, status: string) =>
    apiClient.patch<ApiCase>(`/cases/${id}/status`, { status }),

  /** POST /cases/:id/notes */
  addNote: (id: string, content: string) =>
    apiClient.post<ApiCase>(`/cases/${id}/notes`, { content }),

  /** PATCH /cases/:id/checklist/:itemId */
  patchChecklist: (id: string, itemId: string, isCompleted: boolean) =>
    apiClient.patch<ApiCase>(`/cases/${id}/checklist/${itemId}`, { isCompleted }),
};
