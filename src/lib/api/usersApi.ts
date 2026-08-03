import apiClient from './client';
import { User, UserQuery, CreateUserDto, UpdateUserDto, ChangePasswordDto, PaginatedResult } from '@/types';

export const usersApi = {
  getAll: async (params?: UserQuery) => {
    const { data } = await apiClient.get<PaginatedResult<User>>('/users', { params });
    return data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<User>(`/users/${id}`);
    return data;
  },

  create: async (payload: CreateUserDto) => {
    const { data } = await apiClient.post<User>('/users', payload);
    return data;
  },

  update: async (id: number, payload: UpdateUserDto) => {
    const { data } = await apiClient.patch<User>(`/users/${id}`, payload);
    return data;
  },

  changePassword: async (id: number, payload: ChangePasswordDto) => {
    const { data } = await apiClient.post<{ success: boolean; message: string }>(
      `/users/${id}/change-password`,
      payload
    );
    return data;
  },

  delete: async (id: number) => {
    const { data } = await apiClient.delete<{ success: boolean; message: string }>(
      `/users/${id}`
    );
    return data;
  },
};
