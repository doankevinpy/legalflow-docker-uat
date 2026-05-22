import { apiClient } from './apiClient';
import type { PaginatedResponse } from './api-types';

export interface AuditLog {
  id: string;
  actorUserId: string | null;
  actorEmail: string;
  action: string;
  targetUserId: string | null;
  targetEmail: string | null;
  details: string;
  createdAt: string;
}

export interface GetAuditLogsParams {
  page?: number;
  limit?: number;
  action?: string;
  actor?: string;
  target?: string;
  startDate?: string;
  endDate?: string;
}

export const auditLogApi = {
  getLogs: async (params: GetAuditLogsParams): Promise<PaginatedResponse<AuditLog>> => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.action) query.append('action', params.action);
    if (params.actor) query.append('actor', params.actor);
    if (params.target) query.append('target', params.target);
    if (params.startDate) query.append('startDate', params.startDate);
    if (params.endDate) query.append('endDate', params.endDate);

    const qs = query.toString();
    const url = `/admin-audit-logs${qs ? '?' + qs : ''}`;
    const response = await apiClient.get<PaginatedResponse<AuditLog>>(url);
    return response;
  },
};
