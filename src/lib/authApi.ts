// ============================================================
// authApi.ts – Các hàm gọi /auth endpoints
// ============================================================

import { apiClient } from './apiClient';
import type { ApiUser, LoginResponse } from './api-types';

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<LoginResponse>('/auth/login', { email, password }),

  getProfile: () =>
    apiClient.get<ApiUser>('/auth/profile'),
};
