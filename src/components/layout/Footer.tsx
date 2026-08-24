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

export default function Footer() {
  const currentYear = new Date().getFullYear();

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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'flex-start' }}>
                <PlaceOutlinedIcon sx={{ fontSize: 18, mt: 0.3, color: brandColors.yellow }} />
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  Số 5 Nguyễn Văn Vĩnh, P.4, Q. Tân Bình, TP.HCM
                  <br />
                  ĐT: (028) 6678 1779
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'flex-start' }}>
                <PlaceOutlinedIcon sx={{ fontSize: 18, mt: 0.3, color: brandColors.yellow }} />
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  Gllogistics Quy Nhơn — Bình Định
                  <br />
                  ĐT: (056) 353 1419 — 091 442 7842
                </Typography>
              </Box>
              <Box
                component="a"
                href="tel:0907277502"
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 1,
                  color: brandColors.yellow,
                  fontWeight: 700,
                  pt: 0.5,
                }}
              >
                <PhoneInTalkIcon sx={{ fontSize: 18 }} />
                Hotline 0907.277.502
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
          Bản quyền © 2010–{currentYear} thuộc Gllogistics.net. Quản lý bởi CÔNG TY TNHH GIA LONG LOGISTICS VIỆT NAM.
        </Typography>
      </Container>
    </Box>
  );
}
