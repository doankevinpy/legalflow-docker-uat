// ============================================================
// useApiCases.ts – Async hook thay thế useCases.ts cho backend
// Giữ nguyên useCases.ts để Drafts tiếp tục dùng localStorage
// ============================================================

import { useState, useCallback } from 'react';
import { casesApi } from '../lib/casesApi';
import type { ApiCase, CaseStats, PaginatedResponse, QueryCasesParams } from '../lib/api-types';
import { ApiError } from '../lib/apiClient';

export function useApiCases() {
  const [cases, setCases] = useState<ApiCase[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<ApiCase>['meta'] | null>(null);
  const [stats, setStats] = useState<CaseStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCases = useCallback(async (params: QueryCasesParams = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await casesApi.getCases(params);
      setCases(res.data);
      setMeta(res.meta);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Lỗi tải danh sách hồ sơ');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await casesApi.getStats();
      setStats(res);
    } catch {
      // Không block UI nếu stats lỗi
    }
  }, []);

  return {
    cases,
    meta,
    stats,
    isLoading,
    error,
    fetchCases,
    fetchStats,
  };
}
