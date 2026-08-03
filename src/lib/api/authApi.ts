import apiClient from './client';
import type { AdminUser, LoginPayload, LoginResult } from '@/types';

export const authApi = {
  login(payload: LoginPayload) {
    return apiClient
      .post<LoginResult>('/auth/login', payload)
      .then((res) => res.data);
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    }
  },

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('admin_token');
  },

  getUser(): AdminUser | null {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('admin_user');
    return user ? JSON.parse(user) : null;
  },

  setSession(result: LoginResult) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('admin_token', result.accessToken);
    localStorage.setItem('admin_user', JSON.stringify(result.user));
  },
};
