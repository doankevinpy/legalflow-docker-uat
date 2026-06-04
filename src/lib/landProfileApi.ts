import { apiClient } from './apiClient';
import type { ApiLandProfile, CreateLandProfilePayload, UpdateLandProfilePayload } from './api-types';

export const landProfileApi = {
  getLandProfile: (caseId: string) =>
    apiClient.get<ApiLandProfile>(`/cases/${caseId}/land-profile`),

  createLandProfile: (caseId: string, dto: CreateLandProfilePayload) =>
    apiClient.post<ApiLandProfile>(`/cases/${caseId}/land-profile`, dto),

  updateLandProfile: (caseId: string, dto: UpdateLandProfilePayload) =>
    apiClient.patch<ApiLandProfile>(`/cases/${caseId}/land-profile`, dto),
};
