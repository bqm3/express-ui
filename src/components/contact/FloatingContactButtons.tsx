'use client';

import { Box, Tooltip } from '@mui/material';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import type { ContactChannel, ContactChannelType } from '@/types';
import { contactChannelHref } from '@/lib/contactChannel';
import { brandColors } from '@/lib/theme';

function ChannelIcon({ channel }: { channel: ContactChannelType }) {
  const sx = { fontSize: 26 };
  switch (channel) {
    case 'zalo':
      return (
        <Box
          component="img"
          src="/zalo.png"
          alt="Zalo"
          aria-hidden
          sx={{ width: 34, height: 34, display: 'block', objectFit: 'contain' }}
        />
      );
    case 'facebook':
      return (
        <Box
          component="img"
          src="/facebook.png"
          alt="Facebook"
          aria-hidden
          sx={{ width: 32, height: 32, display: 'block', objectFit: 'contain' }}
        />
      );
    case 'email':
      return <EmailIcon sx={{ ...sx, color: '#EA4335' }} />;
    case 'other':
      return <LinkIcon sx={{ ...sx, color: brandColors.onSurfaceVariant }} />;
    default:
      return <PhoneInTalkIcon sx={{ ...sx, color: '#ffffff' }} />;
  }
}

function channelBg(channel: ContactChannelType) {
  switch (channel) {
    case 'zalo':
      return '#1877F2';
    case 'phone':
      return '#25D366';
    case 'facebook':
      return '#1877F2';
    case 'email':
      return '#EA4335';
    default:
      return brandColors.primaryContainer;
  }
}

interface FloatingContactButtonsProps {
  initialContacts?: ContactChannel[];
}

export default function FloatingContactButtons({
  initialContacts = [],
}: FloatingContactButtonsProps) {
  const contacts = initialContacts.filter((c) => c.isActive !== false);

  if (!contacts.length) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        right: { xs: 16, md: 24 },
        bottom: { xs: 20, md: 28 },
        zIndex: 1300,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.75,
      }}
    >
      {contacts.map((c, idx) => {
        const href = contactChannelHref(c);
        const isExternal = c.channel !== 'phone' && c.channel !== 'email';
        const bg = channelBg(c.channel);
        const isZalo = c.channel === 'zalo';

        return (
          <Tooltip
            key={c.id}
            title={`${c.name}${
              c.displayValue
                ? ` — ${c.displayValue}`
                : c.value
                  ? ` — ${c.value}`
                  : ''
            }`}
            placement="left"
            arrow
          >
            <Box
              component="a"
              href={href}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              aria-label={c.name}
              sx={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                bgcolor: bg,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: isZalo ? '1px solid rgba(0,0,0,0.12)' : 'none',
                boxShadow: isZalo
                  ? '0 4px 16px rgba(0,0,0,0.18)'
                  : `0 4px 16px ${bg}66`,
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                animation:
                  c.channel === 'phone' || c.channel === 'zalo'
                    ? `pulseIcon 2.5s ease-in-out ${idx * 0.3}s infinite`
                    : 'none',
                '@keyframes pulseIcon': {
                  '0%, 100%': {
                    transform: 'scale(1)',
                    boxShadow: isZalo
                      ? '0 4px 16px rgba(0,0,0,0.18)'
                      : `0 4px 16px ${bg}66`,
                  },
                  '50%': {
                    transform: 'scale(1.08)',
                    boxShadow: isZalo
                      ? '0 6px 22px rgba(0,0,0,0.25), 0 0 0 6px rgba(0,104,255,0.15)'
                      : `0 6px 22px ${bg}99, 0 0 0 6px ${bg}22`,
                  },
                },
                '&:hover': {
                  transform: 'scale(1.12) translateY(-2px)',
                  boxShadow: isZalo
                    ? '0 8px 24px rgba(0,0,0,0.22)'
                    : `0 8px 24px ${bg}aa`,
                },
              }}
            >
              <ChannelIcon channel={c.channel} />
            </Box>
          </Tooltip>
        );
      })}
    </Box>
  );
}
