'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppBar,
  Box,
  Button,
  Collapse,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import GLLogo from '@/components/common/GLLogo';
import { brandColors } from '@/lib/theme';
import { categoriesApi } from '@/lib/api/categoriesApi';
import type { MenuCategoryItem } from '@/types';

type NavChild = { label: string; href: string };
type NavItem = {
  key: string;
  label: string;
  href: string;
  children?: NavChild[];
};

function buildNavFromMenu(menu: MenuCategoryItem[]): NavItem[] {
  const categoryItems: NavItem[] = menu.map((cat) => {
    const childItems: NavChild[] = (cat.children || []).map((c) => ({
      label: c.name,
      href: `/${c.slug}`,
    }));

    return {
      key: `cat-${cat.id}`,
      label: cat.name,
      href: `/${cat.slug}`,
      children: childItems.length ? childItems : undefined,
    };
  });

  return [
    { key: 'home', label: 'Trang chủ', href: '/' },
    ...categoryItems,
  ];
}

function navItemHref(item: NavItem) {
  return item.href;
}

function isNavActive(item: NavItem, pathname: string) {
  if (item.href === '/') return pathname === '/';
  if (pathname === item.href || pathname.startsWith(`${item.href}/`)) return true;
  return Boolean(
    item.children?.some(
      (c) => pathname === c.href || pathname.startsWith(`${c.href}/`),
    ),
  );
}

interface HeaderProps {
  initialMenu?: MenuCategoryItem[];
}

export default function Header({ initialMenu = [] }: HeaderProps = {}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileExpand, setMobileExpand] = useState<string | null>(null);
  const navItems = useMemo(() => buildNavFromMenu(initialMenu), [initialMenu]);

  return (
    <>
      <Box component="header">
        <Box
          sx={{
            bgcolor: brandColors.navy,
            color: '#fff',
            py: 0.75,
            fontSize: 13,
          }}
        >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="body2"
              sx={{ opacity: 0.9, display: { xs: 'none', sm: 'block' } }}
            >
              Dịch vụ gửi hàng đi nước ngoài uy tín — giá rẻ TP.HCM | 15 năm kinh
              nghiệm
            </Typography>
            <Box
              component="a"
              href="tel:0907277502"
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 0.75,
                ml: 'auto',
                color: brandColors.yellow,
                fontWeight: 700,
              }}
            >
              <PhoneInTalkIcon sx={{ fontSize: 18 }} />
              Hotline 0907.277.502
            </Box>
          </Box>
        </Container>
      </Box>
      <Box
        sx={{ bgcolor: '#fff', borderBottom: `1px solid ${brandColors.border}` }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { md: 'center' },
              justifyContent: 'space-between',
              gap: 2,
              py: 1.5,
            }}
          >
            <Box
              component={Link}
              href="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'inline-flex',
              }}
            >
              <GLLogo size={50} />
            </Box>

            <Box
              sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'center' }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  color: brandColors.blue,
                  fontSize: 13,
                  letterSpacing: 0.8,
                  textTransform: 'uppercase',
                }}
              >
                World Wide Express
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary' }}
              >
                Nhanh chóng — An toàn — Chất lượng
              </Typography>
            </Box>

            <Button
              component={Link}
              href="/tra-cuu"
              variant="contained"
              color="secondary"
              startIcon={<SearchIcon />}
              sx={{
                px: 2.5,
                py: 1,
                fontWeight: 800,
                alignSelf: { xs: 'stretch', md: 'center' },
              }}
            >
              Tra cứu đơn vận chuyển
            </Button>
          </Box>
        </Container>
      </Box>
      </Box>

      <AppBar
        position="sticky"
        elevation={0}
        square
        sx={{
          top: 0,
          zIndex: 1200,
          width: '100%',
          alignSelf: 'flex-start',
          bgcolor: brandColors.blue,
          color: '#fff',
          borderRadius: 0,
          borderTop: `2px solid ${brandColors.yellow}`,
          borderBottom: `2px solid ${brandColors.yellow}`,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'stretch',
              minHeight: 54,
            }}
          >
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'row',
                alignItems: 'stretch',
                flex: 1,
                flexWrap: 'nowrap',
              }}
            >
              {navItems.map((item) => {
                const active = isNavActive(item, pathname);
                const hasChildren = Boolean(item.children?.length);
                const href = navItemHref(item);

                return (
                  <Box
                    key={item.key}
                    sx={{
                      position: 'relative',
                      display: 'inline-flex',
                      flexDirection: 'column',
                      alignItems: 'stretch',
                      alignSelf: 'stretch',
                      '&:hover .nav-submenu': {
                        visibility: 'visible',
                        opacity: 1,
                        pointerEvents: 'auto',
                      },
                    }}
                  >
                    <Button
                      component={Link}
                      href={href}
                      color="inherit"
                      endIcon={
                        hasChildren ? (
                          <ExpandMoreIcon sx={{ fontSize: 16 }} />
                        ) : undefined
                      }
                      sx={{
                        height: '100%',
                        minHeight: 54,
                        px: 2.25,
                        py: 0,
                        fontSize: 14,
                        fontWeight: active ? 800 : 600,
                        borderRadius: 0,
                        whiteSpace: 'nowrap',
                        color: active ? brandColors.navy : '#fff',
                        bgcolor: active ? brandColors.yellow : 'transparent',
                        '&:hover': {
                          bgcolor: active
                            ? brandColors.secondaryContainer
                            : 'rgba(255,255,255,0.12)',
                          color: active ? brandColors.navy : '#fff',
                        },
                      }}
                    >
                      {item.label}
                    </Button>

                    {hasChildren && (
                      <Box
                        className="nav-submenu"
                        sx={{
                          visibility: 'hidden',
                          opacity: 0,
                          pointerEvents: 'none',
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          width: '100%',
                          maxHeight: 420,
                          overflowY: 'auto',
                          bgcolor: '#fff',
                          color: brandColors.navy,
                          border: `1px solid ${brandColors.border}`,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                          zIndex: 1300,
                          transition: 'opacity 0.12s ease',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: -8,
                            left: 0,
                            right: 0,
                            height: 8,
                          },
                        }}
                      >
                        {item.children!.map((child) => {
                          const childActive =
                            pathname === child.href ||
                            pathname.startsWith(`${child.href}/`);
                          return (
                            <Box
                              key={child.href + child.label}
                              component={Link}
                              href={child.href}
                              sx={{
                                display: 'block',
                                px: 1.5,
                                py: 1.1,
                                fontSize: 13,
                                fontWeight: childActive ? 700 : 500,
                                color: childActive
                                  ? brandColors.navy
                                  : brandColors.onSurface,
                                bgcolor: childActive
                                  ? 'rgba(255,184,28,0.25)'
                                  : 'transparent',
                                textDecoration: 'none',
                                borderBottom: `1px solid ${brandColors.border}`,
                                wordBreak: 'break-word',
                                '&:last-child': { borderBottom: 0 },
                                '&:hover': {
                                  bgcolor: brandColors.yellow,
                                  color: brandColors.navy,
                                },
                              }}
                            >
                              {child.label}
                            </Box>
                          );
                        })}
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>

            <IconButton
              edge="end"
              onClick={() => setDrawerOpen(true)}
              sx={{
                display: { xs: 'inline-flex', md: 'none' },
                color: '#fff',
                ml: 'auto',
              }}
              aria-label="Menu"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Container>
      </AppBar>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 300, pt: 2.5 }} role="presentation">
          <Box sx={{ px: 2, pb: 2, borderBottom: `1px solid ${brandColors.outlineVariant}`, mb: 1 }}>
            <GLLogo size={38} showSubtitle={false} />
          </Box>
          <List dense>
            {navItems.map((item) => {
              const hasChildren = Boolean(item.children?.length);
              const href = navItemHref(item);
              const active = isNavActive(item, pathname);

              return (
                <Box key={item.key}>
                  {hasChildren ? (
                    <Box sx={{ display: 'flex', alignItems: 'stretch' }}>
                      <ListItemButton
                        component={Link}
                        href={href}
                        selected={active}
                        onClick={() => setDrawerOpen(false)}
                        sx={{
                          flex: 1,
                          '&.Mui-selected': {
                            bgcolor: 'rgba(255,184,28,0.35)',
                          },
                        }}
                      >
                        <ListItemText
                          primary={item.label}
                          slotProps={{
                            primary: {
                              sx: { fontWeight: active ? 700 : 500 },
                            },
                          }}
                        />
                      </ListItemButton>
                      <IconButton
                        size="small"
                        onClick={() =>
                          setMobileExpand(
                            mobileExpand === item.key ? null : item.key,
                          )
                        }
                        aria-label="Mở submenu"
                        sx={{ alignSelf: 'center', mr: 1 }}
                      >
                        {mobileExpand === item.key ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </IconButton>
                    </Box>
                  ) : (
                    <ListItemButton
                      component={Link}
                      href={item.href}
                      selected={active}
                      onClick={() => setDrawerOpen(false)}
                      sx={{
                        '&.Mui-selected': {
                          bgcolor: 'rgba(255,184,28,0.35)',
                        },
                      }}
                    >
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  )}
                  {hasChildren ? (
                    <Collapse in={mobileExpand === item.key}>
                      <List dense disablePadding>
                        {item.children!.map((child) => (
                          <ListItemButton
                            key={child.href + child.label}
                            component={Link}
                            href={child.href}
                            sx={{ pl: 4 }}
                            onClick={() => setDrawerOpen(false)}
                          >
                            <ListItemText primary={child.label} />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  ) : null}
                </Box>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
