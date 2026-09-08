import apiClient from './client';
import type { SiteSettings } from '@/types';

export interface AdminSettingItem {
  key: string;
  value: string;
  description?: string | null;
}

export const settingsApi = {
  getPublicSettings() {
    return apiClient
      .get<SiteSettings>('/settings/public')
      .then((res) => res.data);
  },

  getAdminSettings() {
    return apiClient
      .get<AdminSettingItem[]>('/settings')
      .then((res) => res.data);
  },

  updateSettings(settings: Record<string, string>) {
    return apiClient
      .put<SiteSettings>('/settings', { settings })
      .then((res) => res.data);
  },

  getTelegramUpdates(botToken?: string) {
    return apiClient
      .get<any[]>('/settings/telegram/updates', {
        params: botToken ? { botToken } : {},
      })
      .then((res) => res.data);
  },

  sendTestTelegram(payload: { botToken?: string; chatId: string }) {
    return apiClient
      .post<{ success: boolean; results: any[] }>('/settings/telegram/test', payload)
      .then((res) => res.data);
  },
};
