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

export function removePhoneDots(value?: string | null) {
  return (value || '').replace(/(\d)\.(?=\d)/g, '$1');
}

export function phoneHref(value?: string | null) {
  const digits = removePhoneDots(value).replace(/\D/g, '');
  return digits ? `tel:${digits}` : '#';
}

export function normalizePhoneLink(value?: string | null) {
  const raw = (value || '').trim();
  if (!raw) return '#';

  const withoutDots = removePhoneDots(raw);
  if (/^tel:/i.test(withoutDots)) return phoneHref(withoutDots);
  if (/^[\d\s()+-]+$/.test(withoutDots)) return phoneHref(withoutDots);
  return withoutDots;
}

/** Build clickable href from channel + value */
export function contactChannelHref(item: Pick<ContactChannel, 'channel' | 'value'>) {
  const raw = (item.value || '').trim();
  if (!raw) return '#';

  switch (item.channel) {
    case 'phone':
      return phoneHref(raw);
    case 'zalo': {
      if (/^https?:\/\//i.test(raw)) return raw;
      const digits = removePhoneDots(raw).replace(/\D/g, '');
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
  const value = item.displayValue || item.value;
  return item.channel === 'phone' || item.channel === 'zalo'
    ? removePhoneDots(value)
    : value;
}
