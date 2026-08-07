'use client';

import { useEffect, useState } from 'react';
import { Box, Tooltip } from '@mui/material';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import { contactChannelsApi } from '@/lib/api/contactChannelsApi';
import type { ContactChannel, ContactChannelType } from '@/types';
import { contactChannelHref } from '@/lib/contactChannel';
import { brandColors } from '@/lib/theme';

function ChannelIcon({ channel }: { channel: ContactChannelType }) {
  const sx = { fontSize: 20 };
  switch (channel) {
    case 'zalo':
      return (
        <Box
          component="img"
          src="/zalo.png"
          alt="Zalo"
          aria-hidden
          sx={{ width: 26, height: 26, display: 'block', objectFit: 'contain' }}
        />
      );
    case 'facebook':
      return (
        <Box
          component="img"
          src="/facebook.png"
          alt="Facebook"
          aria-hidden
          sx={{ width: 26, height: 26, display: 'block', objectFit: 'contain' }}
        />
      );
    case 'email':
      return <EmailIcon sx={{ ...sx, color: '#EA4335' }} />;
    case 'other':
      return <LinkIcon sx={{ ...sx, color: brandColors.onSurfaceVariant }} />;
    default:
      return <PhoneInTalkIcon sx={{ ...sx, color: 'red' }} />;
  }
}

function channelBg(channel: ContactChannelType) {
  switch (channel) {
    case 'zalo':     return '#0068FF';
    case 'facebook': return '#1877F2';
    case 'email':    return '#EA4335';
    case 'phone':    return brandColors.velocityOrange;
    default:         return brandColors.primaryContainer;
  }
}

interface FloatingContactButtonsProps {
  initialContacts?: ContactChannel[];
}

export default function FloatingContactButtons({ initialContacts }: FloatingContactButtonsProps) {
  const [contacts, setContacts] = useState<ContactChannel[]>(initialContacts || []);

  useEffect(() => {
    if (initialContacts && initialContacts.length > 0) return;

    let cancelled = false;
    contactChannelsApi
      .publicList()
      .then((list) => {
        if (!cancelled) {
          setContacts(list.filter((c) => c.isActive !== false));
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [initialContacts]);

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
        gap: 1.5,
      }}
    >
      {contacts.map((c, idx) => {
        const href = contactChannelHref(c);
        const isExternal = c.channel !== 'phone' && c.channel !== 'email';
        const bg = channelBg(c.channel);

        return (
          <Tooltip
            key={c.id}
            title={`${c.name}${c.displayValue ? ` — ${c.displayValue}` : c.value ? ` — ${c.value}` : ''}`}
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
                width: 44,
                height: 44,
                borderRadius: '50%',
                bgcolor: bg,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 14px ${bg}66`,
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: c.channel === 'phone' || c.channel === 'zalo' ? `pulseIcon 2.5s ease-in-out ${idx * 0.3}s infinite` : 'none',
                '@keyframes pulseIcon': {
                  '0%, 100%': { transform: 'scale(1)', boxShadow: `0 4px 14px ${bg}66` },
                  '50%': { transform: 'scale(1.08)', boxShadow: `0 6px 20px ${bg}99, 0 0 0 6px ${bg}22` },
                },
                '&:hover': {
                  transform: 'scale(1.12) translateY(-2px)',
                  boxShadow: `0 8px 22px ${bg}aa`,
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
