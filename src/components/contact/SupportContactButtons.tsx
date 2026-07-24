'use client';

import { Box, Stack, Typography } from '@mui/material';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import type { ContactChannel, ContactChannelType } from '@/types';
import {
  contactChannelDisplay,
  contactChannelHref,
} from '@/lib/contactChannel';
import { brandColors } from '@/lib/theme';

function ZaloIcon() {
  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      sx={{ width: 18, height: 18, display: 'block' }}
      aria-hidden
    >
      <circle cx="12" cy="12" r="11" fill="#0068FF" />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fill="#fff"
        fontSize="10"
        fontWeight="800"
        fontFamily="Arial, sans-serif"
      >
        Z
      </text>
    </Box>
  );
}

function channelIcon(channel: ContactChannelType) {
  const sx = { fontSize: 18 };
  switch (channel) {
    case 'zalo':
      return <ZaloIcon />;
    case 'facebook':
      return <FacebookIcon sx={{ ...sx, color: '#1877F2' }} />;
    case 'email':
      return <EmailIcon sx={{ ...sx, color: brandColors.blue }} />;
    case 'other':
      return <LinkIcon sx={{ ...sx, color: brandColors.navy }} />;
    default:
      return <PhoneInTalkIcon sx={{ ...sx, color: brandColors.yellowDark }} />;
  }
}

interface SupportContactButtonsProps {
  contacts: ContactChannel[];
  variant?: 'home' | 'sidebar';
  direction?: 'row' | 'column';
}

export default function SupportContactButtons({
  contacts,
  variant = 'home',
  direction = 'row',
}: SupportContactButtonsProps) {
  if (!contacts.length) return null;

  const isHome = variant === 'home';
  const fullWidth = variant === 'sidebar' || direction === 'column';

  return (
    <Stack
      direction={direction === 'row' ? { xs: 'column', sm: 'row' } : 'column'}
      spacing={1}
      sx={{ width: '100%' }}
    >
      {contacts.map((c) => {
        const external = c.channel !== 'phone' && c.channel !== 'email';

        return (
          <Box
            key={c.id}
            component="a"
            href={contactChannelHref(c)}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              width: fullWidth ? '100%' : 'auto',
              minHeight: 44,
              px: 1.5,
              py: 1,
              textDecoration: 'none',
              color: isHome ? '#fff' : brandColors.navy,
              borderRadius: 0,
              transition: 'filter 0.15s ease, background-color 0.15s ease',
              '&:hover': {
                filter: 'brightness(0.95)',
                bgcolor: isHome
                  ? brandColors.blueDark
                  : brandColors.secondaryContainer,
              },
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                flexShrink: 0,
                display: 'grid',
                placeItems: 'center',
                bgcolor: isHome
                  ? 'rgba(255,255,255,0.14)'
                  : 'rgba(255,255,255,0.55)',
              }}
            >
              {channelIcon(c.channel)}
            </Box>

            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '0.875rem',
                lineHeight: 1.35,
                color: 'inherit',
              }}
            >
              {c.name}
              <Box
                component="span"
                sx={{
                  display: 'block',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  opacity: 0.85,
                }}
              >
                {contactChannelDisplay(c)}
              </Box>
            </Typography>
          </Box>
        );
      })}
    </Stack>
  );
}
