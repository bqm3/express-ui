'use client';

import { Box, Stack, Typography } from '@mui/material';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import {
  contactChannelDisplay,
  contactChannelHref,
  contactChannelLabel,
} from '@/lib/contactChannel';
import { brandColors } from '@/lib/theme';
import type { ContactChannel, ContactChannelType } from '@/types';


function ZaloIcon({ size = 28 }: { size?: number }) {
  return (
    <Box
      component="img"
      src="/zalo.png"
      alt="Zalo"
      sx={{ width: size, height: size, display: 'block', objectFit: 'contain' }}
      aria-hidden
    />
  );
}

function channelIcon(channel: ContactChannelType) {
  switch (channel) {
    case 'zalo':
      return <ZaloIcon size={28} />;
    case 'facebook':
      return (
        <FacebookOutlinedIcon sx={{ fontSize: 26, color: '#1877F2' }} />
      );
    case 'email':
      return (
        <EmailOutlinedIcon sx={{ fontSize: 26, color: brandColors.blue }} />
      );
    case 'other':
      return (
        <LinkOutlinedIcon sx={{ fontSize: 26, color: brandColors.navy }} />
      );
    default:
      return <PhoneInTalkIcon sx={{ fontSize: 22, color: '#ffffff' }} />;
  }
}

function channelIconBg(channel: ContactChannelType) {
  switch (channel) {
    case 'zalo':
      return '#1877F2';
    case 'phone':
      return '#25D366';
    default:
      return 'rgba(0,0,0,0.04)';
  }
}

function channelAccent(channel: ContactChannelType) {
  switch (channel) {
    case 'zalo':
      return '#0068FF';
    case 'phone':
      return '#25D366';
    case 'facebook':
      return '#1877F2';
    case 'email':
      return brandColors.blue;
    case 'other':
      return brandColors.navy;
    default:
      return '#25D366';
  }
}

interface ContactChannelCardsProps {
  initialContacts?: ContactChannel[];
}

export default function ContactChannelCards({
  initialContacts = [],
}: ContactChannelCardsProps = {}) {
  const contacts = initialContacts.filter((c) => c.isActive !== false);

  if (!contacts.length) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, mb: 1.5, color: brandColors.blueDark }}
      >
        Kênh liên hệ nhanh
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{ flexWrap: 'wrap' }}
      >
        {contacts.map((c) => (
          <Box
            key={c.id}
            component="a"
            href={contactChannelHref(c)}
            target={
              c.channel === 'phone' || c.channel === 'email'
                ? undefined
                : '_blank'
            }
            rel={
              c.channel === 'phone' || c.channel === 'email'
                ? undefined
                : 'noopener noreferrer'
            }
            sx={{
              flex: { sm: '1 1 180px' },
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.5,
              textDecoration: 'none',
              color: 'inherit',
              bgcolor: 'background.paper',
              border: `1px solid ${brandColors.border}`,
              borderLeft: `4px solid ${channelAccent(c.channel)}`,
              borderRadius: 0,
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              '&:hover': {
                borderColor: channelAccent(c.channel),
                boxShadow: '0 4px 14px rgba(27, 41, 116, 0.1)',
              },
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                bgcolor: channelIconBg(c.channel),
                border: c.channel === 'zalo' ? '1px solid rgba(0,0,0,0.12)' : 'none',
                boxShadow:
                  c.channel === 'phone'
                    ? '0 2px 8px rgba(37,211,102,0.35)'
                    : c.channel === 'zalo'
                      ? '0 2px 8px rgba(0,0,0,0.1)'
                      : 'none',
              }}
            >
              {channelIcon(c.channel)}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  color: 'text.secondary',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.4,
                }}
              >
                {contactChannelLabel(c.channel)}
              </Typography>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: brandColors.navy,
                  fontSize: '0.95rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {c.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', fontSize: '0.85rem' }}
              >
                {contactChannelDisplay(c)}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
