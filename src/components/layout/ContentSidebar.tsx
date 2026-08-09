'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { categoriesApi } from '@/lib/api/categoriesApi';
import { contactChannelsApi } from '@/lib/api/contactChannelsApi';
import SupportContactButtons from '@/components/contact/SupportContactButtons';
import type { ContactChannel, SidebarCategoryBlock } from '@/types';
import { brandFonts } from '@/lib/theme';

const PRIMARY_COLOR = '#00614f';

function SidebarHeader({ title }: { title: string }) {
  return (
    <Box
      sx={{
        px: 2,
        py: 1.25,
        bgcolor: PRIMARY_COLOR,
        color: '#ffffff',
      }}
    >
      <Typography
        sx={{
          fontFamily: brandFonts.labelCaps,
          fontWeight: 700,
          fontSize: '0.78rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#ffffff',
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}

export default function ContentSidebar() {
  const [blocks, setBlocks] = useState<SidebarCategoryBlock[]>([]);
  const [contacts, setContacts] = useState<ContactChannel[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [sidebarBlocks, channelList] = await Promise.all([
        categoriesApi.sidebar().catch(() => [] as SidebarCategoryBlock[]),
        contactChannelsApi.publicList().catch(() => [] as ContactChannel[]),
      ]);

      if (!cancelled) {
        setBlocks(sidebarBlocks.filter((b) => b.posts.length > 0));
        setContacts(channelList.filter((c) => c.isActive !== false));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Box
      component="aside"
      sx={{
        position: { md: 'sticky' },
        top: { md: 88 },
        maxWidth: { md: 300 },
        ml: { md: 'auto' },
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
      }}
    >
      {/* ── Support Block ── */}
      <Box
        sx={{
          border: `1px solid rgba(0, 97, 79, 0.18)`,
          bgcolor: '#ffffff',
          overflow: 'hidden',
        }}
      >
        <SidebarHeader title="Hỗ Trợ Khách Hàng" />

        <Box sx={{ p: 2 }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                bgcolor: 'rgba(0, 97, 79, 0.08)',
                color: PRIMARY_COLOR,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <SupportAgentOutlinedIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#1a1a1a', lineHeight: 1.3 }}>
                Tư vấn miễn phí
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: PRIMARY_COLOR, fontWeight: 600 }}>
                8:00 – 18:00 (Hàng ngày)
              </Typography>
            </Box>
          </Stack>

          <SupportContactButtons
            contacts={contacts}
            variant="sidebar"
            direction="column"
          />
        </Box>
      </Box>

      {/* ── Category Blocks ── */}
      {blocks.map((block) => (
        <Box
          key={block.slug}
          sx={{
            border: `1px solid rgba(0, 97, 79, 0.18)`,
            bgcolor: '#ffffff',
            overflow: 'hidden',
          }}
        >
          <SidebarHeader title={block.name} />

          <List dense disablePadding sx={{ py: 1 }}>
            {block.posts.map((p) => (
              <ListItemButton
                key={p.id}
                component={Link}
                href={`/${p.slug}`}
                sx={{
                  px: 2,
                  py: 0.75,
                  transition: 'background-color 0.15s ease',
                  '&:hover': {
                    bgcolor: 'rgba(0, 97, 79, 0.05)',
                    '& .sidebar-post-title': { color: PRIMARY_COLOR },
                  },
                }}
              >
                <ListItemText
                  primary={p.title}
                  slotProps={{
                    primary: {
                      className: 'sidebar-post-title',
                      variant: 'body2',
                      sx: {
                        fontWeight: 600,
                        color: '#222222',
                        lineHeight: 1.45,
                        fontSize: '0.82rem',
                        transition: 'color 0.15s ease',
                      },
                    },
                  }}
                />
              </ListItemButton>
            ))}

            <ListItemButton
              component={Link}
              href={`/${block.slug}`}
              sx={{
                px: 2,
                py: 0.75,
                mt: 0.5,
                bgcolor: 'rgba(0, 97, 79, 0.04)',
                borderTop: `1px solid rgba(0, 97, 79, 0.1)`,
                '&:hover': { bgcolor: 'rgba(0, 97, 79, 0.08)' },
              }}
            >
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                <ChevronRightIcon sx={{ fontSize: 16, color: PRIMARY_COLOR }} />
                <Typography
                  sx={{
                    color: PRIMARY_COLOR,
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    fontFamily: brandFonts.labelCaps,
                    letterSpacing: '0.04em',
                  }}
                >
                  Xem tất cả
                </Typography>
              </Stack>
            </ListItemButton>
          </List>
        </Box>
      ))}
    </Box>
  );
}

