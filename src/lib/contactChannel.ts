import type { ContactChannel, ContactChannelType } from '@/types';

const channelLabels: Record<ContactChannelType, string> = {
  phone: 'Điện thoại',
  zalo: 'Zalo',
  facebook: 'Facebook',
  email: 'Email',
  other: 'Khác',
};

export function contactChannelLabel(channel: ContactChannelType) {
  return channelLabels[channel] || channel;
}

/** Build clickable href from channel + value */
export function contactChannelHref(item: Pick<ContactChannel, 'channel' | 'value'>) {
  const raw = (item.value || '').trim();
  if (!raw) return '#';

  switch (item.channel) {
    case 'phone': {
      const digits = raw.replace(/\D/g, '');
      return digits ? `tel:${digits}` : '#';
    }
    case 'zalo': {
      if (/^https?:\/\//i.test(raw)) return raw;
      const digits = raw.replace(/\D/g, '');
      return digits ? `https://zalo.me/${digits}` : raw;
    }
    case 'facebook':
      if (/^https?:\/\//i.test(raw)) return raw;
      return `https://facebook.com/${raw.replace(/^@/, '')}`;
    case 'email':
      return raw.startsWith('mailto:') ? raw : `mailto:${raw}`;
    default:
      return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  }
}

export function contactChannelDisplay(item: ContactChannel) {
  return item.displayValue || item.value;
}
