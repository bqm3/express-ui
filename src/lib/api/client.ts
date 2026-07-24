import axios, { AxiosError, type AxiosResponse } from 'axios';
import type { ApiResponse } from '@/types';

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const apiClient = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const payload = response.data as ApiResponse | unknown;

    if (
      payload &&
      typeof payload === 'object' &&
      'success' in payload &&
      (payload as ApiResponse).success === true &&
      'data' in payload
    ) {
      response.data = (payload as ApiResponse).data;
    }

    return response;
  },
  (error: AxiosError<ApiResponse>) => {
    const raw = error.response?.data?.message;
    const message =
      (Array.isArray(raw) ? raw.join(', ') : raw) ||
      error.response?.data?.error ||
      error.message ||
      'Đã xảy ra lỗi';

    return Promise.reject(new Error(String(message)));
  },
);

export default apiClient;
