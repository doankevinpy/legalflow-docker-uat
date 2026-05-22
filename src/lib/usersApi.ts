import { apiClient } from './apiClient';
import type { ApiUser } from './api-types';

export interface CreateUserDto {
  email: string;
  fullName: string;
  role: string;
  passwordTemp: string;
}

export interface UpdateUserDto {
  fullName?: string;
  role?: string;
  isActive?: boolean;
}

export const usersApi = {
  getAll: () => apiClient.get<ApiUser[]>('/users'),
  create: (dto: CreateUserDto) => apiClient.post<ApiUser>('/users', dto),
  update: (id: string, dto: UpdateUserDto) => apiClient.patch<ApiUser>(`/users/${id}`, dto),
  resetPassword: (id: string, passwordTemp: string) => apiClient.post<{ message: string }>(`/users/${id}/reset-password`, { passwordTemp }),
  delete: (id: string) => apiClient.delete<void>(`/users/${id}`),
};
