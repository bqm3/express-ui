import apiClient from './client';
import type { UploadResult } from '@/types';

export const uploadApi = {
  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient
      .post<UploadResult>('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data);
  },
};
