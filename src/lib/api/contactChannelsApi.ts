import apiClient from './client';
import type {
  ContactChannel,
  CreateContactChannelPayload,
  PaginatedResult,
  UpdateContactChannelPayload,
} from '@/types';

export type ContactChannelListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  channel?: string;
};

export const contactChannelsApi = {
  publicList() {
    return apiClient
      .get<ContactChannel[]>('/contact-channels/public')
      .then((res) => res.data);
  },

  list(query?: ContactChannelListQuery) {
    return apiClient
      .get<PaginatedResult<ContactChannel>>('/contact-channels', {
        params: {
          page: query?.page ?? 1,
          limit: query?.limit ?? 20,
          ...(query?.search ? { search: query.search } : {}),
          ...(query?.channel ? { channel: query.channel } : {}),
        },
      })
      .then((res) => res.data);
  },

  create(payload: CreateContactChannelPayload) {
    return apiClient
      .post<ContactChannel>('/contact-channels', payload)
      .then((res) => res.data);
  },

  update(id: number, payload: UpdateContactChannelPayload) {
    return apiClient
      .patch<ContactChannel>(`/contact-channels/${id}`, payload)
      .then((res) => res.data);
  },

  remove(id: number) {
    return apiClient
      .delete(`/contact-channels/${id}`)
      .then((res) => res.data);
  },
};
