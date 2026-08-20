import axios, { AxiosError, type AxiosResponse } from 'axios';
import type { ApiResponse } from '@/types';

const serverUrl =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://apiexpress.couponzas.com/api/v1';

// Server-side (SSR) calls backend API directly.
// Client-side (Browser) calls relative '/api/v1' proxy to avoid exposing backend URL.
const baseURL = typeof window === 'undefined' ? serverUrl : '/api/v1';

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
