import apiClient from './client';
import type {
  CreatePostPayload,
  PaginatedResult,
  Post,
  PostQuery,
  UpdatePostPayload,
} from '@/types';

function toParams(query?: PostQuery) {
  return {
    page: query?.page ?? 1,
    limit: query?.limit ?? 10,
    ...(query?.categorySlug ? { categorySlug: query.categorySlug } : {}),
    ...(query?.categoryId ? { categoryId: query.categoryId } : {}),
    ...(query?.status ? { status: query.status } : {}),
    ...(query?.search ? { search: query.search } : {}),
    ...(query?.withDeleted ? { withDeleted: query.withDeleted } : {}),
  };
}

export const postsApi = {
  list(query?: PostQuery) {
    return apiClient
      .get<PaginatedResult<Post>>('/posts', { params: toParams(query) })
      .then((res) => res.data);
  },

  adminList(query?: PostQuery) {
    return apiClient
      .get<PaginatedResult<Post>>('/admin/posts', { params: toParams(query) })
      .then((res) => res.data);
  },

  getBySlug(slug: string) {
    return apiClient.get<Post>(`/posts/slug/${slug}`).then((res) => res.data);
  },

  getRelated(slug: string) {
    return apiClient
      .get<Post[]>(`/posts/slug/${slug}/related`)
      .then((res) => res.data);
  },

  getById(id: number) {
    return apiClient.get<Post>(`/posts/${id}`).then((res) => res.data);
  },

  create(payload: CreatePostPayload) {
    return apiClient.post<Post>('/posts', payload).then((res) => res.data);
  },

  update(id: number, payload: UpdatePostPayload) {
    return apiClient
      .patch<Post>(`/posts/${id}`, payload)
      .then((res) => res.data);
  },

  remove(id: number) {
    return apiClient.delete(`/posts/${id}`).then((res) => res.data);
  },

  restore(id: number) {
    return apiClient.post(`/posts/${id}/restore`).then((res) => res.data);
  },
};
