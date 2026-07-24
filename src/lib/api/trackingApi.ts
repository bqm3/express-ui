import apiClient from './client';
import type {
  Carrier,
  PaginatedResult,
  TrackShipmentPayload,
  TrackingLog,
  TrackingLogQuery,
  TrackingResult,
} from '@/types';

export const trackingApi = {
  track(payload: TrackShipmentPayload) {
    return apiClient
      .post<TrackingResult>('/tracking', payload)
      .then((res) => res.data);
  },

  detect(trackingNumber: string) {
    return apiClient
      .get<{ carrier: Carrier | null }>('/tracking/detect', {
        params: { trackingNumber },
      })
      .then((res) => res.data);
  },

  logs(query?: TrackingLogQuery) {
    return apiClient
      .get<PaginatedResult<TrackingLog>>('/tracking/logs', {
        params: {
          page: query?.page ?? 1,
          limit: query?.limit ?? 20,
          ...(query?.carrier ? { carrier: query.carrier } : {}),
          ...(query?.trackingNumber
            ? { trackingNumber: query.trackingNumber }
            : {}),
        },
      })
      .then((res) => res.data);
  },

  stats() {
    return apiClient
      .get<Record<string, unknown>>('/tracking/stats')
      .then((res) => res.data);
  },
};
