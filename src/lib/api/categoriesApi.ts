import apiClient from './client';
import type {
  Category,
  CreateCategoryPayload,
  MenuCategoryItem,
  PaginatedResult,
  ResolveSlugResult,
  SidebarCategoryBlock,
  UpdateCategoryPayload,
} from '@/types';

export const categoriesApi = {
  list() {
    return apiClient.get<Category[]>('/categories').then((res) => res.data);
  },

  adminList(query?: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    return apiClient
      .get<PaginatedResult<Category>>('/categories', {
        params: {
          withPostCount: true,
          page: query?.page ?? 1,
          limit: query?.limit ?? 15,
          ...(query?.search ? { search: query.search } : {}),
        },
      })
      .then((res) => res.data);
  },

  tree() {
    return apiClient.get<Category[]>('/categories/tree').then((res) => res.data);
  },

  menu() {
    return apiClient
      .get<MenuCategoryItem[]>('/categories/menu')
      .then((res) => res.data);
  },

  sidebar() {
    return apiClient
      .get<SidebarCategoryBlock[]>('/categories/sidebar')
      .then((res) => res.data);
  },

  resolve(slug: string, query?: { page?: number; limit?: number }) {
    return apiClient
      .get<ResolveSlugResult>(`/categories/resolve/${slug}`, {
        params: {
          page: query?.page ?? 1,
          limit: query?.limit ?? 12,
        },
      })
      .then((res) => res.data);
  },

  getBySlug(slug: string) {
    return apiClient
      .get<Category>(`/categories/slug/${slug}`)
      .then((res) => res.data);
  },

  getById(id: number) {
    return apiClient.get<Category>(`/categories/${id}`).then((res) => res.data);
  },

  create(payload: CreateCategoryPayload) {
    return apiClient
      .post<Category>('/categories', payload)
      .then((res) => res.data);
  },

  update(id: number, payload: UpdateCategoryPayload) {
    return apiClient
      .patch<Category>(`/categories/${id}`, payload)
      .then((res) => res.data);
  },

  remove(id: number) {
    return apiClient.delete(`/categories/${id}`).then((res) => res.data);
  },
};
