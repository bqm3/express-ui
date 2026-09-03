'use client';

import Link from 'next/link';
import {
  Box,
  Container,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import GLLogo from '@/components/common/GLLogo';
import { brandColors } from '@/lib/theme';
import type { FooterBranch, SiteSettings } from '@/types';

const countryLinks = [
  'Gửi hàng đi Mỹ',
  'Gửi hàng đi Úc',
  'Gửi hàng đi Anh Quốc',
  'Gửi hàng đi Đức',
  'Gửi hàng đi Nhật',
  'Gửi hàng đi Hàn Quốc',
  'Gửi hàng đi Canada',
  'Gửi hàng đi Malaysia',
  'Gửi hàng đi Thái Lan',
  'Gửi hàng đi Đài Loan',
];

const carrierLinks = [
  { label: 'Chuyển phát nhanh DHL', href: '/chuyen-phat-nhanh' },
  { label: 'Chuyển phát nhanh FedEx', href: '/chuyen-phat-nhanh' },
  { label: 'Chuyển phát nhanh UPS', href: '/chuyen-phat-nhanh' },
];

const quickLinks = [
  { label: 'Giới thiệu', href: '/lien-he' },
  { label: 'Hỗ trợ khách hàng', href: '/ho-tro' },
  { label: 'Cẩm nang', href: '/cam-nang' },
  { label: 'Tra cứu vận đơn', href: '/tra-cuu' },
  { label: 'Liên hệ', href: '/lien-he' },
];

interface FooterProps {
  settings?: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const footerHotline = settings?.footer_hotline || 'Hotline 0907.277.502';
  const footerHotlineLink = settings?.footer_hotline_link || 'tel:0907277502';

  let branches: FooterBranch[] = [];
  try {
    if (settings?.footer_branches) {
      const parsed = JSON.parse(settings.footer_branches);
      if (Array.isArray(parsed)) {
        branches = parsed;
      }
    }
  } catch {
    branches = [];
  }

  if (!branches || branches.length === 0) {
    branches = [
      {
        title: '',
        address: 'Số 5 Nguyễn Văn Vĩnh, P.4, Q. Tân Bình, TP.HCM',
        phone: 'ĐT: (028) 6678 1779',
      },
      {
        title: 'GLLogistics Quy Nhơn — Bình Định',
        address: '',
        phone: 'ĐT: (056) 353 1419 — 091 442 7842',
      },
    ];
  }

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        bgcolor: brandColors.navy,
        color: 'rgba(255,255,255,0.88)',
        pt: { xs: 5, md: 6 },
        pb: 2,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ mb: 2 }}>
              <GLLogo size={42} variant="dark" />
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 2, lineHeight: 1.7 }}>
              CÔNG TY TNHH GIA LONG LOGISTICS VIỆT NAM.
              Chuyên vận chuyển hàng hóa đi nước ngoài và nhập hàng về Việt Nam.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {branches.map((b, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1,
                    alignItems: 'flex-start',
                  }}
                >
                  <PlaceOutlinedIcon
                    sx={{ fontSize: 18, mt: 0.3, color: brandColors.yellow, flexShrink: 0 }}
                  />
                  <Typography variant="body2" sx={{ opacity: 0.85, lineHeight: 1.5 }}>
                    {b.title && (
                      <Box component="span" sx={{ fontWeight: 700, display: 'block', mb: 0.25 }}>
                        {b.title}
                      </Box>
                    )}
                    {b.address && (
                      <Box component="span" sx={{ display: 'block' }}>
                        {b.address}
                      </Box>
                    )}
                    {b.phone && (
                      <Box component="span" sx={{ display: 'block', opacity: 0.9 }}>
                        {b.phone}
                      </Box>
                    )}
                  </Typography>
                </Box>
              ))}

              <Box
                component="a"
                href={footerHotlineLink}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 1,
                  color: brandColors.yellow,
                  fontWeight: 700,
                  pt: 0.5,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                <PhoneInTalkIcon sx={{ fontSize: 18 }} />
                {footerHotline}
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography sx={{ fontWeight: 700, mb: 1.5, color: brandColors.yellow }}>
              Liên kết nhanh
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.85 }}>
              {quickLinks.map((item) => (
                <Typography
                  key={item.href + item.label}
                  component={Link}
                  href={item.href}
                  variant="body2"
                  sx={{ opacity: 0.8, '&:hover': { color: brandColors.yellow } }}
                >
                  {item.label}
                </Typography>
              ))}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography sx={{ fontWeight: 700, mb: 1.5, color: brandColors.yellow }}>
              Gửi hàng nước ngoài
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.85 }}>
              {countryLinks.map((label) => (
                <Typography
                  key={label}
                  component={Link}
                  href="/gui-hang-di-nuoc-ngoai"
                  variant="body2"
                  sx={{ opacity: 0.8, '&:hover': { color: brandColors.yellow } }}
                >
                  {label}
                </Typography>
              ))}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <Typography sx={{ fontWeight: 700, mb: 1.5, color: brandColors.yellow }}>
              Hãng vận chuyển
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.85 }}>
              {carrierLinks.map((item) => (
                <Typography
                  key={item.label}
                  component={Link}
                  href={item.href}
                  variant="body2"
                  sx={{ opacity: 0.8, '&:hover': { color: brandColors.yellow } }}
                >
                  {item.label}
                </Typography>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.12)' }} />
        <Typography variant="caption" sx={{ opacity: 0.55, display: 'block', textAlign: 'center' }}>
          Bản quyền © 2026 thuộc Gia Long Logistics. Quản lý bởi CÔNG TY TNHH GIA LONG LOGISTICS VIỆT NAM.
        </Typography>
      </Container>
    </Box>
  );
}
