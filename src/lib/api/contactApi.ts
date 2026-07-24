import apiClient from './client';
import type {
  ContactQuery,
  ContactRequest,
  CreateContactPayload,
  PaginatedResult,
  UpdateContactPayload,
} from '@/types';

export const contactApi = {
  create(payload: CreateContactPayload) {
    return apiClient
      .post<ContactRequest>('/contacts', payload)
      .then((res) => res.data);
  },

  list(query?: ContactQuery) {
    return apiClient
      .get<PaginatedResult<ContactRequest>>('/contacts', {
        params: {
          page: query?.page ?? 1,
          limit: query?.limit ?? 20,
          ...(query?.status ? { status: query.status } : {}),
          ...(query?.from ? { from: query.from } : {}),
          ...(query?.to ? { to: query.to } : {}),
          ...(query?.search ? { search: query.search } : {}),
        },
      })
      .then((res) => res.data);
  },

  getById(id: number) {
    return apiClient
      .get<ContactRequest>(`/contacts/${id}`)
      .then((res) => res.data);
  },

  update(id: number, payload: UpdateContactPayload) {
    return apiClient
      .patch<ContactRequest>(`/contacts/${id}`, payload)
      .then((res) => res.data);
  },
};
