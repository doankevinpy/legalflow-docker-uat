import { apiClient } from './apiClient';

export interface AnalyticsFilterDto {
  startDate?: string;
  endDate?: string;
  neighborhood?: string;
  field?: string;
  type?: string;
  status?: string;
}

export interface OverviewStats {
  totalCases: number;
  newCases: number;
  inProgressCases: number;
  respondedCases: number;
  closedCases: number;
}

export interface NeighborhoodStat {
  neighborhood: string;
  count: number;
}

export interface FieldStat {
  field: string;
  count: number;
}

export interface CrossTabStat {
  neighborhood: string;
  field: string;
  count: number;
}

export interface SocialInsights {
  disclaimers: string[];
  observations: string[];
  hypotheses: string[];
  recommendations: string[];
}

export const analyticsApi = {
  getOverview: async (filters?: AnalyticsFilterDto): Promise<OverviewStats> => {
    const qs = filters ? '?' + new URLSearchParams(filters as any).toString() : '';
    return apiClient.get(`/analytics/overview${qs}`);
  },

  getByNeighborhood: async (filters?: AnalyticsFilterDto): Promise<NeighborhoodStat[]> => {
    const qs = filters ? '?' + new URLSearchParams(filters as any).toString() : '';
    return apiClient.get(`/analytics/by-neighborhood${qs}`);
  },

  getByField: async (filters?: AnalyticsFilterDto): Promise<FieldStat[]> => {
    const qs = filters ? '?' + new URLSearchParams(filters as any).toString() : '';
    return apiClient.get(`/analytics/by-field${qs}`);
  },

  getCrossTab: async (filters?: AnalyticsFilterDto): Promise<CrossTabStat[]> => {
    const qs = filters ? '?' + new URLSearchParams(filters as any).toString() : '';
    return apiClient.get(`/analytics/cross-tab${qs}`);
  },

  getSocialInsights: async (filters?: AnalyticsFilterDto): Promise<SocialInsights> => {
    const qs = filters ? '?' + new URLSearchParams(filters as any).toString() : '';
    return apiClient.get(`/analytics/social-insights${qs}`);
  }
};
