'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { authApi } from '@/lib/api/authApi';
import { brandColors } from '@/lib/theme';

const DRAWER_WIDTH = 260;
const HEADER_HEIGHT = 64;

const shellBorder = `1px solid ${brandColors.border}`;
const shellBg = brandColors.white;

const navItems = [
  { label: 'Bài viết', href: '/admin/posts', icon: <ArticleOutlinedIcon /> },
  {
    label: 'Danh mục',
    href: '/admin/categories',
    icon: <CategoryOutlinedIcon />,
  },
  { label: 'Media', href: '/admin/media', icon: <ImageOutlinedIcon /> },
  {
    label: 'Kênh liên hệ',
    href: '/admin/contact-channels',
    icon: <SupportAgentOutlinedIcon />,
  },
  { label: 'Liên hệ', href: '/admin/contacts', icon: <MailOutlinedIcon /> },
  {
    label: 'Tracking logs',
    href: '/admin/tracking-logs',
    icon: <TimelineOutlinedIcon />,
  },
];

function getPageTitle(pathname: string) {
  const match = navItems.find((item) => pathname.startsWith(item.href));
  if (match) return match.label;
  if (pathname.startsWith('/admin')) return 'Tổng quan';
  return 'Admin';
}

function BrandMark() {
  return (
    <Stack
      direction="row"
      spacing={1.25}
      sx={{
        alignItems: "center",
        minWidth: 0
      }}>
      <Box
        sx={{
          width: 36,
          height: 36,
          flexShrink: 0,
          borderRadius: 0,
          bgcolor: brandColors.primaryContainer,
          color: brandColors.onPrimary,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <LocalShippingOutlinedIcon fontSize="small" />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          noWrap
          sx={{
            fontWeight: 700,
            fontSize: '0.95rem',
            lineHeight: 1.25,
            color: brandColors.onSurface
          }}>
          SwiftShip
        </Typography>
        <Typography
          variant="caption"
          noWrap
          sx={{ color: brandColors.onSurfaceVariant, display: 'block', lineHeight: 1.2 }}
        >
          Admin Panel
        </Typography>
      </Box>
    </Stack>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [ready, setReady] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLogin = pathname === '/admin/login';
  const pageTitle = getPageTitle(pathname);

  useEffect(() => {
    if (isLogin) {
      setReady(true);
      return;
    }
    const token = authApi.getToken();
    if (!token) {
      router.replace('/admin/login');
      return;
    }
    setReady(true);
  }, [isLogin, router, pathname]);

  if (isLogin) {
    return <>{children}</>;
  }

  if (!ready) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <Typography sx={{ color: 'text.secondary' }}>
          Đang kiểm tra phiên...
        </Typography>
      </Box>
    );
  }

  const handleLogout = () => {
    authApi.logout();
    router.replace('/admin/login');
  };

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: shellBg,
      }}
    >
      {/* Same height / border as AppBar so they align as one chrome */}
      <Box
        sx={{
          height: HEADER_HEIGHT,
          minHeight: HEADER_HEIGHT,
          maxHeight: HEADER_HEIGHT,
          boxSizing: 'border-box',
          px: 2,
          display: 'flex',
          alignItems: 'center',
          borderBottom: shellBorder,
          flexShrink: 0,
        }}
      >
        <BrandMark />
      </Box>

      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Typography
          variant="overline"
          sx={{ color: brandColors.onSurfaceVariant, letterSpacing: '0.08em' }}
        >
          Menu
        </Typography>
      </Box>

      <List sx={{ flex: 1, px: 0, py: 0 }}>
        {navItems.map((item) => {
          const selected = pathname.startsWith(item.href);
          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={selected}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: 0,
                px: 2,
                py: 1.25,
                color: selected
                  ? brandColors.primaryContainer
                  : brandColors.onSurfaceVariant,
                '&.Mui-selected': {
                  bgcolor: `${brandColors.primaryContainer}14`,
                  color: brandColors.primaryContainer,
                  '&:hover': {
                    bgcolor: `${brandColors.primaryContainer}22`,
                  },
                  '& .MuiListItemIcon-root': {
                    color: brandColors.primaryContainer,
                  },
                },
                '&:hover': {
                  bgcolor: brandColors.surfaceLow,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: selected
                    ? brandColors.primaryContainer
                    : brandColors.onSurfaceVariant,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{
                  primary: {
                    sx: {
                      fontWeight: selected ? 700 : 500,
                      fontSize: '0.875rem',
                    },
                  },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ borderColor: brandColors.border }} />
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogoutOutlinedIcon />}
          onClick={handleLogout}
          sx={{
            justifyContent: 'flex-start',
            borderRadius: 0,
            borderColor: brandColors.border,
            color: brandColors.onSurfaceVariant,
            '&:hover': {
              borderColor: brandColors.outline,
              bgcolor: brandColors.surfaceLow,
            },
          }}
        >
          Đăng xuất
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: brandColors.offWhite }}>
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': {
                width: DRAWER_WIDTH,
                borderRadius: 0,
                borderRight: shellBorder,
                bgcolor: shellBg,
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            open
            sx={{
              '& .MuiDrawer-paper': {
                width: DRAWER_WIDTH,
                borderRadius: 0,
                borderRight: shellBorder,
                boxSizing: 'border-box',
                bgcolor: shellBg,
              },
            }}
          >
            {drawer}
          </Drawer>
        )}
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AppBar
          position="sticky"
          square
          elevation={0}
          color="inherit"
          sx={{
            height: HEADER_HEIGHT,
            minHeight: HEADER_HEIGHT,
            maxHeight: HEADER_HEIGHT,
            boxSizing: 'border-box',
            bgcolor: shellBg,
            borderBottom: shellBorder,
            color: brandColors.onSurface,
            borderRadius: '0 !important',
            justifyContent: 'center',
          }}
        >
          <Toolbar
            disableGutters
            variant="dense"
            sx={{
              height: '100%',
              minHeight: '100% !important',
              maxHeight: '100%',
              px: { xs: 2, md: 3 },
              gap: 1.5,
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            {isMobile ? (
              <>
                <IconButton
                  edge="start"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Mở menu"
                  sx={{ color: brandColors.onSurfaceVariant }}
                >
                  <MenuIcon />
                </IconButton>
                <BrandMark />
              </>
            ) : (
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    lineHeight: 1.25,
                    color: brandColors.onSurface
                  }}>
                  {pageTitle}
                </Typography>
                <Typography
                  variant="caption"
                  noWrap
                  sx={{
                    color: brandColors.onSurfaceVariant,
                    display: 'block',
                    lineHeight: 1.2,
                  }}
                >
                  Quản trị nội dung
                </Typography>
              </Box>
            )}

            {isMobile && <Box sx={{ flex: 1 }} />}

            <Stack direction="row" spacing={1} sx={{
              alignItems: "center"
            }}>
              <Button
                component={Link}
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                variant="outlined"
                endIcon={<OpenInNewOutlinedIcon sx={{ fontSize: 16 }} />}
                sx={{
                  borderRadius: 0,
                  borderColor: brandColors.border,
                  color: brandColors.onSurfaceVariant,
                  display: { xs: 'none', sm: 'inline-flex' },
                  '&:hover': {
                    borderColor: brandColors.outline,
                    bgcolor: brandColors.surfaceLow,
                  },
                }}
              >
                Xem website
              </Button>
              {isMobile && (
                <IconButton
                  onClick={handleLogout}
                  aria-label="Đăng xuất"
                  sx={{ color: brandColors.onSurfaceVariant }}
                >
                  <LogoutOutlinedIcon />
                </IconButton>
              )}
            </Stack>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: { xs: 2, md: 3 }, flex: 1 }}>{children}</Box>
      </Box>
    </Box>
  );
}
