// ============================================================
// casesApi.ts – Wrapper cho tất cả /cases endpoints
// ============================================================

import { apiClient } from './apiClient';
import type {
  ApiCase,
  ApiCaseNote,
  ApiChecklistItem,
  CaseStats,
  CreateCaseDto,
  PaginatedResponse,
  QueryCasesParams,
  UpdateCaseDto,
  AiSummarizeResponse,
  AiClassifyResponse,
  AiChecklistResponse,
  AiDraftResponse,
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
    apiClient.post<ApiCaseNote>(`/cases/${id}/notes`, { content }),

  /** PATCH /cases/:id/checklist/:itemId */
  patchChecklist: (id: string, itemId: string, isCompleted: boolean) =>
    apiClient.patch<ApiChecklistItem>(`/cases/${id}/checklist/${itemId}`, { isCompleted }),

  /** POST /cases/:id/documents */
  uploadDocument: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<any>(`/cases/${id}/documents`, formData);
  },

  /** GET /cases/:id/documents/:docId/download */
  downloadDocument: (id: string, docId: string) =>
    apiClient.get<{ url: string }>(`/cases/${id}/documents/${docId}/download`),

  /** GET /cases/:id/notes/:noteId/export-docx */
  exportDocx: (id: string, noteId: string) =>
    apiClient.downloadBlob(`/cases/${id}/notes/${noteId}/export-docx`),

  /** GET /cases/:id/notes/:noteId/preview-data */
  getDraftPreviewData: (id: string, noteId: string) =>
    apiClient.get<any>(`/cases/${id}/notes/${noteId}/preview-data`),


  /** POST /ai/summarize */
  aiSummarize: (text: string, caseId?: string) =>
    apiClient.post<AiSummarizeResponse>('/ai/summarize', { text, caseId }),

  /** POST /ai/classify */
  aiClassify: (text: string, caseId?: string) =>
    apiClient.post<AiClassifyResponse>('/ai/classify', { text, caseId }),

  /** POST /ai/checklist */
  aiSuggestChecklist: (params: { text?: string; caseId?: string; type?: string; field?: string; summary?: string; request?: string }) =>
    apiClient.post<AiChecklistResponse>('/ai/checklist', params),

  /** POST /ai/draft */
  aiSuggestDraft: (params: { caseId: string; draftType: string; customInstructions?: string }) =>
    apiClient.post<AiDraftResponse>('/ai/draft', params),

  /** POST /ai/feedback */
  aiSubmitFeedback: (
    caseId: string,
    feedback: 'ACCEPTED' | 'REJECTED',
    applyToCase?: boolean,
    feedbackType?: string,
    checklistItems?: string[],
    draftType?: string,
    draftTitle?: string,
    draftContent?: string
  ) =>
    apiClient.post<{ success: boolean; caseUpdated: boolean }>('/ai/feedback', {
      caseId,
      feedback,
      applyToCase,
      feedbackType,
      checklistItems,
      draftType,
      draftTitle,
      draftContent,
    }),
};

