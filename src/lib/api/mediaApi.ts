import apiClient from './client';
import type { MediaItem, MediaQuery, MediaTypeItem, PaginatedResult } from '@/types';

export type CreateMediaPayload = {
  type: string;
  url: string;
  title?: string;
  altText?: string;
  linkUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
};

export const mediaApi = {
  types() {
    return apiClient.get<MediaTypeItem[]>('/media/types').then((res) => res.data);
  },

  createType(payload: {
    code: string;
    name: string;
    description?: string;
  }) {
    return apiClient
      .post<MediaTypeItem>('/media/types', payload)
      .then((res) => res.data);
  },

  updateType(
    id: number,
    payload: Partial<{ code: string; name: string; description: string }>,
  ) {
    return apiClient
      .patch<MediaTypeItem>(`/media/types/${id}`, payload)
      .then((res) => res.data);
  },

  removeType(id: number) {
    return apiClient.delete(`/media/types/${id}`).then((res) => res.data);
  },

  banners() {
    return apiClient.get<MediaItem[]>('/media/banners').then((res) => res.data);
  },

  list(query?: MediaQuery) {
    return apiClient
      .get<PaginatedResult<MediaItem>>('/media', { params: query })
      .then((res) => res.data);
  },

  get(id: number) {
    return apiClient.get<MediaItem>(`/media/${id}`).then((res) => res.data);
  },

  create(payload: CreateMediaPayload) {
    return apiClient.post<MediaItem>('/media', payload).then((res) => res.data);
  },

  upload(
    file: File,
    options: {
      type: string;
      title?: string;
      altText?: string;
      linkUrl?: string;
      sortOrder?: number;
      isActive?: boolean;
    },
  ) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', options.type);
    if (options.title) formData.append('title', options.title);
    if (options.altText) formData.append('altText', options.altText);
    if (options.linkUrl) formData.append('linkUrl', options.linkUrl);
    if (typeof options.sortOrder === 'number') {
      formData.append('sortOrder', String(options.sortOrder));
    }
    if (typeof options.isActive === 'boolean') {
      formData.append('isActive', String(options.isActive));
    }

    return apiClient
      .post<MediaItem>('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data);
  },

  update(
    id: number,
    payload: Partial<
      Pick<
        MediaItem,
        | 'title'
        | 'altText'
        | 'url'
        | 'linkUrl'
        | 'sortOrder'
        | 'isActive'
        | 'mediaTypeId'
      >
    >,
  ) {
    return apiClient
      .patch<MediaItem>(`/media/${id}`, payload)
      .then((res) => res.data);
  },

  remove(id: number) {
    return apiClient.delete(`/media/${id}`).then((res) => res.data);
  },
};
