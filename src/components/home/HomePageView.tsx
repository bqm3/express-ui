'use client';

import Link from 'next/link';
import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import FlightTakeoffOutlinedIcon from '@mui/icons-material/FlightTakeoffOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PostList from '@/components/posts/PostList';
import PostCardModern from '@/components/posts/PostCardModern';
import PostCardTechnical from '@/components/posts/PostCardTechnical';
import ScrollReveal from '@/components/common/ScrollReveal';
import BannerSlider from '@/components/home/BannerSlider';
import ContentSidebar from '@/components/layout/ContentSidebar';
import type { MediaItem, Post } from '@/types';
import { brandColors, brandFonts } from '@/lib/theme';

/* ──────────────────── STATIC DATA ──────────────────── */

const defaultCarriers = [
  { name: 'DHL Express', desc: 'Đại lý DHL — vận chuyển quốc tế hoả tốc, 220+ quốc gia.', color: '#D40511' },
  { name: 'UPS Logistics', desc: 'Mạng lưới vận tải toàn cầu cam kết đúng hẹn và tối ưu chi phí.', color: '#301506' },
  { name: 'FedEx Express', desc: 'Vận tải hàng không chuyên nghiệp, bảo hiểm 100% hàng hoá.', color: '#4D148C' },
];

const STATS = [
  { value: '200+', label: 'Quốc gia & Vùng lãnh thổ', icon: <PublicOutlinedIcon sx={{ fontSize: 26 }} />, delay: '0s' },
  { value: '50.000+', label: 'Bưu gửi thành công', icon: <AssignmentTurnedInOutlinedIcon sx={{ fontSize: 26 }} />, delay: '0.1s' },
  { value: '15+', label: 'Năm uy tín ngành logistics', icon: <SpeedOutlinedIcon sx={{ fontSize: 26 }} />, delay: '0.2s' },
  { value: '10.000+', label: 'Doanh nghiệp & Cá nhân tin dùng', icon: <PeopleOutlinedIcon sx={{ fontSize: 26 }} />, delay: '0.3s' },
];

const TRUST_ITEMS = [
  { icon: <VerifiedOutlinedIcon sx={{ fontSize: 22 }} />, title: 'Bảo Hiểm 100%', desc: 'Cam kết an toàn tuyệt đối cho mọi kiện hàng', color: brandColors.primaryContainer, delay: '0s' },
  { icon: <LocalOfferOutlinedIcon sx={{ fontSize: 22 }} />, title: 'Cước Phí Tối Ưu', desc: 'Chiết khấu lớn cho khách hàng đại lý & doanh nghiệp', color: brandColors.velocityOrange, delay: '0.1s' },
  { icon: <SupportAgentOutlinedIcon sx={{ fontSize: 22 }} />, title: 'Hỗ Trợ 24/7', desc: 'Đội ngũ chuyên viên tư vấn tận tâm & xử lý nhanh', color: brandColors.primaryContainer, delay: '0.2s' },
];

/* ──────────────────── PROPS ──────────────────── */

interface HomePageViewProps {
  guiHangPosts?: Post[];
  chuyenPhatNhanhPosts?: Post[];
  camNangPosts?: Post[];
  carrierPosts?: Post[];
  recentPosts?: Post[];
  countryPosts?: Post[];
  carriers?: Array<{ name: string; desc: string; color?: string }>;
  banners?: MediaItem[];
}

/* ──────────────────── COMPONENT ──────────────────── */

export default function HomePageView({
  guiHangPosts = [],
  chuyenPhatNhanhPosts = [],
  camNangPosts = [],
  carrierPosts = [],
  recentPosts = [],
  countryPosts = [],
  carriers,
  banners = [],
}: HomePageViewProps) {
  const guiHangList = guiHangPosts.length > 0 ? guiHangPosts : countryPosts;
  const chuyenPhatList = chuyenPhatNhanhPosts;
  const camNangList = camNangPosts.length > 0 ? camNangPosts : recentPosts;
  const carrierList =
    carrierPosts.length > 0
      ? carrierPosts.map((p, i) => ({
          name: p.title,
          desc: p.shortDescription || p.metaDescription || '',
          color: defaultCarriers[i % defaultCarriers.length]?.color,
        }))
      : carriers && carriers.length > 0
      ? carriers
      : defaultCarriers;

  return (
    <>
      {/* ── 1. HERO BANNER ────────────────────────────────────────────── */}
      {banners.length >= 1 ? (
        <BannerSlider banners={banners} />
      ) : (
        <HeroBannerSection />
      )}

      {/* ── 2. ANIMATED TRUCK ROAD STRIP ─────────────────────────────── */}
      <TruckRoadStrip />

      {/* ── 3. CRISP STATS COUNTER GRID ──────────────────────────────── */}
      <Box
        sx={{
          bgcolor: '#ffffff',
          borderBottom: `1px solid ${brandColors.outlineVariant}`,
          py: 3,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            {STATS.map((s) => (
              <Grid key={s.label} size={{ xs: 6, md: 3 }}>
                <Box
                  className="anim-fade-up"
                  sx={{
                    height: '100%',
                    p: 2.5,
                    borderRadius: 0,
                    bgcolor: brandColors.surfaceContainerLow,
                    border: `1px solid ${brandColors.outlineVariant}`,
                    borderLeft: `4px solid ${brandColors.primaryContainer}`,
                    transition: 'all 0.25s ease',
                    animationDelay: s.delay,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      bgcolor: '#ffffff',
                      boxShadow: '0 8px 24px rgba(13, 124, 102, 0.12)',
                      borderLeftColor: brandColors.velocityOrange,
                      '& .stat-icon': {
                        transform: 'scale(1.15) rotate(-5deg)',
                        color: brandColors.velocityOrange,
                      },
                    },
                  }}
                >
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1 }}>
                    <Box
                      className="stat-icon"
                      sx={{
                        color: brandColors.primaryContainer,
                        transition: 'transform 0.3s ease, color 0.3s ease',
                      }}
                    >
                      {s.icon}
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: { xs: '1.5rem', md: '1.85rem' },
                        color: brandColors.primaryContainer,
                        fontFamily: brandFonts.headline,
                        lineHeight: 1,
                      }}
                    >
                      {s.value}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      color: brandColors.onSurfaceVariant,
                      fontWeight: 600,
                      fontSize: '0.8rem',
                    }}
                  >
                    {s.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── 4. CRISP TRUST CARDS BAR ─────────────────────────────────── */}
      <Box
        sx={{
          bgcolor: brandColors.surfaceContainerLow,
          borderBottom: `1px solid ${brandColors.outlineVariant}`,
          py: 2.5,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            {TRUST_ITEMS.map((item) => (
              <Grid key={item.title} size={{ xs: 12, md: 4 }}>
                <Box
                  className="anim-fade-up"
                  sx={{
                    height: '100%',
                    p: 2,
                    borderRadius: 0,
                    bgcolor: '#ffffff',
                    border: `1px solid ${brandColors.outlineVariant}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    animationDelay: item.delay,
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      borderColor: item.color,
                      boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                      '& .trust-icon-box': {
                        bgcolor: item.color,
                        color: '#ffffff',
                      },
                    },
                  }}
                >
                  <Box
                    className="trust-icon-box"
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: 0,
                      bgcolor: brandColors.surfaceContainerLow,
                      color: item.color,
                      border: `1px solid ${brandColors.outlineVariant}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: brandColors.onSurface }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: brandColors.onSurfaceVariant, fontSize: '0.8rem' }}>
                      {item.desc}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── 5. MAIN CONTENT AREA + SIDEBAR ───────────────────────────── */}
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={{ xs: 5, md: 6 }}>

              {/* Company Intro Card (Sharp & Technical) */}
              <Box
                className="anim-fade-up"
                sx={{
                  position: 'relative',
                  p: { xs: 3, md: 4 },
                  borderRadius: 0,
                  bgcolor: '#ffffff',
                  border: `1px solid ${brandColors.outlineVariant}`,
                  borderLeft: `5px solid ${brandColors.primaryContainer}`,
                  boxShadow: '0 4px 20px rgba(17, 28, 45, 0.04)',
                  transition: 'box-shadow 0.25s ease, border-left-color 0.25s ease',
                  '&:hover': {
                    boxShadow: '0 8px 30px rgba(13, 124, 102, 0.09)',
                    borderLeftColor: brandColors.velocityOrange,
                  },
                }}
              >
                <Stack spacing={1.5}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.75,
                      px: 1.25,
                      py: 0.35,
                      borderRadius: 0,
                      bgcolor: brandColors.surfaceContainerLow,
                      color: brandColors.primaryContainer,
                      fontFamily: brandFonts.labelCaps,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      width: 'fit-content',
                      border: `1px solid ${brandColors.outlineVariant}`,
                    }}
                  >
                    <LocationOnOutlinedIcon sx={{ fontSize: 14 }} />
                    VỀ CHÚNG TÔI
                  </Box>
                  <Typography
                    variant="h2"
                    sx={{
                      color: brandColors.primaryContainer,
                      fontWeight: 700,
                      fontSize: { xs: '1.3rem', md: '1.6rem' },
                    }}
                  >
                    CÔNG TY TNHH GIA LONG LOGISTICS VIỆT NAM
                  </Typography>
                  <Typography
                    sx={{
                      color: brandColors.onSurfaceVariant,
                      fontSize: { xs: '0.93rem', md: '0.98rem' },
                      lineHeight: 1.8,
                    }}
                  >
                    GLLOGISTICS — Chuyên vận chuyển hàng hóa đi nước ngoài và nhập hàng từ tất cả các quốc gia về Việt Nam bằng đường hàng không & đường biển. Nhận vận chuyển mỹ phẩm, dược phẩm, hàng cồng kềnh, quà tặng... với quy trình thủ tục trọn gói, chi phí tối ưu nhất.
                  </Typography>
                </Stack>
              </Box>

              {/* Express Delivery Posts Section: using PostCardModern */}
              <SectionBlock
                overline="DỊCH VỤ NỔI BẬT"
                overlineColor={brandColors.velocityOrange}
                heading="Chuyển Phát Nhanh"
                href="/chuyen-phat-nhanh"
              >
                {chuyenPhatList.length > 0 ? (
                  <Grid container spacing={2.5}>
                    {chuyenPhatList.map((item, idx) => (
                      <Grid key={item.id || item.slug} size={{ xs: 12, sm: 6 }}>
                        <ScrollReveal animation="fadeInUp" delay={idx * 0.08}>
                          <PostCardModern post={item} />
                        </ScrollReveal>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <EmptyNote text="Chưa có bài viết thuộc chuyên mục Chuyển phát nhanh." />
                )}
              </SectionBlock>

              {/* Overseas Shipping Section: using PostCardTechnical */}
              <SectionBlock
                overline="CHUYÊN TUYẾN QUỐC TẾ"
                overlineColor={brandColors.primaryContainer}
                heading="Gửi Hàng Đi Nước Ngoài"
                href="/gui-hang-di-nuoc-ngoai"
              >
                {guiHangList.length > 0 ? (
                  <Grid container spacing={2.5}>
                    {guiHangList.map((item, idx) => (
                      <Grid key={item.id || item.slug} size={{ xs: 12 }}>
                        <ScrollReveal animation="fadeInRight" delay={idx * 0.1}>
                          <PostCardTechnical post={item} />
                        </ScrollReveal>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <EmptyNote text="Chưa có bài viết thuộc chuyên mục Gửi hàng đi nước ngoài." />
                )}
              </SectionBlock>

              {/* Carriers Block */}
              <ScrollReveal animation="zoomIn">
                <CrispCarrierBlock carriers={carrierList} />
              </ScrollReveal>

              {/* Experience Guides Section */}
              <ScrollReveal animation="fadeInUp">
                <SectionBlock
                  overline="CẨM NANG HỖ TRỢ"
                  overlineColor={brandColors.primaryContainer}
                  heading="Chia Sẻ Kinh Nghiệm Gửi Hàng"
                  href="/cam-nang"
                >
                  <PostList
                    posts={camNangList}
                    emptyMessage="Chưa có bài viết cẩm nang. Hãy quay lại sau."
                  />
                </SectionBlock>
              </ScrollReveal>

            </Stack>
          </Grid>

          {/* Right Sticky Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            <ContentSidebar />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

/* ──────────────────── SUB-COMPONENTS ──────────────────── */

function HeroBannerSection() {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: 380, md: 470 },
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${brandColors.forestDeep} 0%, ${brandColors.primary} 45%, ${brandColors.primaryContainer} 100%)`,
        backgroundSize: '200% 200%',
        animation: 'bgShift 10s ease infinite',
        color: '#ffffff',
        overflow: 'hidden',
      }}
    >
      {/* Animated Glow Blobs */}
      <Box
        sx={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          right: { xs: '-20%', md: '2%' },
          top: { xs: '15%', md: '-20%' },
          background: `radial-gradient(circle, rgba(249,115,22,0.22) 0%, rgba(13,124,102,0.05) 60%, transparent 80%)`,
          filter: 'blur(50px)',
          animation: 'pulseGlow 7s ease-in-out infinite alternate',
        }}
      />

      {/* Floating Plane Icon */}
      <Box
        sx={{
          position: 'absolute',
          right: { xs: '2%', md: '6%' },
          top: { xs: '10%', md: '14%' },
          opacity: { xs: 0.1, md: 0.16 },
          animation: 'floatY 4s ease-in-out infinite',
          pointerEvents: 'none',
          display: { xs: 'none', sm: 'block' },
        }}
      >
        <FlightTakeoffOutlinedIcon sx={{ fontSize: 160, color: '#ffffff' }} />
      </Box>

      {/* Spinning Globe Background Icon */}
      <Box
        sx={{
          position: 'absolute',
          left: { xs: '-10%', md: '-4%' },
          bottom: { xs: '-10%', md: '-20%' },
          opacity: 0.06,
          animation: 'spinSlow 22s linear infinite',
          pointerEvents: 'none',
          display: { xs: 'none', md: 'block' },
        }}
      >
        <PublicOutlinedIcon sx={{ fontSize: 280, color: '#ffffff' }} />
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', py: { xs: 7, md: 9 }, zIndex: 1 }}>
        <Stack spacing={3} sx={{ maxWidth: 700 }}>
          {/* Live Indicator Pill Badge (Crisp 4px radius) */}
          <Box
            className="anim-fade-left"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 1.75,
              py: 0.5,
              borderRadius: 0,
              bgcolor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              width: 'fit-content',
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: '#4ade80',
                boxShadow: '0 0 10px #4ade80',
              }}
            />
            <PublicOutlinedIcon sx={{ fontSize: 14, color: brandColors.velocityOrange }} />
            <Typography
              sx={{
                fontFamily: brandFonts.labelCaps,
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: brandColors.onPrimaryContainer,
                textTransform: 'uppercase',
              }}
            >
              Giải Pháp Logistics Quốc Tế Toàn Diện
            </Typography>
          </Box>

          {/* Heading */}
          <Typography
            variant="h1"
            className="anim-fade-up"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.9rem', md: '2.9rem' },
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              textShadow: '0 2px 12px rgba(0,0,0,0.18)',
            }}
          >
            Dịch vụ gửi hàng đi nước ngoài{' '}
            <Box
              component="span"
              sx={{
                color: brandColors.velocityOrange,
                display: 'inline-block',
              }}
            >
              uy tín
            </Box>{' '}
            — giá rẻ TP.HCM
          </Typography>

          <Typography
            className="anim-fade-up-d1"
            sx={{
              opacity: 0.9,
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.75,
            }}
          >
            GLLOGISTICS — CÔNG TY TNHH GIA LONG LOGISTICS VIỆT NAM. Nhanh chóng, an toàn, chất lượng hàng đầu.
          </Typography>

          {/* Action Buttons (Sharp 0px radius) */}
          <Stack
            className="anim-fade-up-d2"
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ pt: 0.5 }}
          >
            <Button
              component={Link}
              href="/tra-cuu"
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<SearchOutlinedIcon />}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 0,
                fontWeight: 700,
                boxShadow: '0 8px 24px rgba(249, 115, 22, 0.38)',
                transition: 'all 0.25s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 14px 32px rgba(249, 115, 22, 0.48)',
                },
              }}
            >
              Tra cứu đơn vận chuyển
            </Button>
            <Button
              component={Link}
              href="/lien-he"
              variant="outlined"
              size="large"
              endIcon={<ArrowForwardIcon className="anim-arrow-bounce" />}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 0,
                borderColor: 'rgba(255,255,255,0.4)',
                color: '#ffffff',
                backdropFilter: 'blur(4px)',
                transition: 'all 0.25s ease',
                '&:hover': {
                  borderColor: '#ffffff',
                  bgcolor: 'rgba(255,255,255,0.15)',
                  transform: 'translateY(-3px)',
                },
              }}
            >
              Liên hệ tư vấn
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

function TruckRoadStrip() {
  return (
    <Box
      sx={{
        position: 'relative',
        bgcolor: brandColors.forestDeep,
        py: 1.25,
        overflow: 'hidden',
        borderBottom: `2px solid ${brandColors.velocityOrange}`,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `repeating-linear-gradient(90deg, ${brandColors.velocityOrange} 0px, ${brandColors.velocityOrange} 20px, transparent 20px, transparent 40px)`,
        }}
      />
      <Container maxWidth="lg">
        <Stack direction="row" spacing={4} sx={{ alignItems: 'center', overflow: 'hidden' }}>
          <Box
            sx={{
              animation: 'truckSlide 14s linear infinite',
              '@keyframes truckSlide': {
                '0%': { transform: 'translateX(-200px)', opacity: 0 },
                '5%': { opacity: 1 },
                '85%': { opacity: 1 },
                '100%': { transform: 'translateX(120vw)', opacity: 0 },
              },
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexShrink: 0,
            }}
          >
            <LocalShippingOutlinedIcon sx={{ fontSize: 22, color: brandColors.velocityOrange }} />
            <Typography
              sx={{
                fontFamily: brandFonts.labelCaps,
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '0.08em',
                whiteSpace: 'nowrap',
              }}
            >
              GLLOGISTICS — GIAO HÀNG TOÀN CẦU • 200+ QUỐC GIA • AN TOÀN & ĐÚNG HẸN
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

function SectionBlock({
  overline,
  overlineColor,
  heading,
  href,
  children,
}: {
  overline: string;
  overlineColor: string;
  heading: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Box className="anim-fade-up">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ justifyContent: 'space-between', alignItems: { sm: 'flex-end' }, mb: 2.5 }}
      >
        <Box>
          <Typography
            variant="overline"
            sx={{
              fontFamily: brandFonts.labelCaps,
              color: overlineColor,
              fontWeight: 700,
              letterSpacing: '0.06em',
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
            }}
          >
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                width: 16,
                height: 2,
                bgcolor: overlineColor,
              }}
            />
            {overline}
          </Typography>
          <Typography
            variant="h2"
            sx={{ color: brandColors.primaryContainer, fontWeight: 700, fontSize: '1.45rem', mt: 0.25 }}
          >
            {heading}
          </Typography>
        </Box>
        <Button
          component={Link}
          href={href}
          endIcon={<ArrowForwardIcon className="anim-arrow-bounce" />}
          sx={{
            fontWeight: 600,
            color: brandColors.primaryContainer,
            mt: { xs: 0.5, sm: 0 },
            borderRadius: 0,
            '&:hover': { bgcolor: brandColors.surfaceContainerLow },
          }}
        >
          Xem tất cả
        </Button>
      </Stack>
      {children}
    </Box>
  );
}



function CrispCarrierBlock({ carriers }: { carriers: Array<{ name: string; desc: string; color?: string }> }) {
  return (
    <Box
      className="anim-fade-up"
      sx={{
        position: 'relative',
        p: { xs: 3, md: 4 },
        borderRadius: 0,
        background: `linear-gradient(135deg, ${brandColors.forestDeep} 0%, #043d2a 100%)`,
        color: '#ffffff',
        border: `1px solid ${brandColors.outlineVariant}`,
        boxShadow: '0 12px 36px rgba(6, 78, 59, 0.22)',
        overflow: 'hidden',
      }}
    >
      <Stack spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
        <Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
            <FlightTakeoffOutlinedIcon sx={{ fontSize: 18, color: brandColors.velocityOrange }} />
            <Typography
              variant="overline"
              sx={{
                fontFamily: brandFonts.labelCaps,
                color: brandColors.velocityOrange,
                fontWeight: 700,
                letterSpacing: '0.09em',
              }}
            >
              ĐỐI TÁC VẬN CHUYỂN
            </Typography>
          </Stack>
          <Typography variant="h2" sx={{ fontWeight: 700, fontSize: { xs: '1.3rem', md: '1.6rem' } }}>
            Hãng Chuyển Phát Nhanh Quốc Tế Uy Tín
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {carriers.map((c, idx) => (
            <Grid key={c.name} size={{ xs: 12, sm: 6, md: 4 }}>
              <Box
                sx={{
                  p: 2.5,
                  height: '100%',
                  borderRadius: 0,
                  bgcolor: 'rgba(255, 255, 255, 0.07)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  transition: 'all 0.25s ease',
                  animationDelay: `${idx * 0.12}s`,
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    borderColor: brandColors.velocityOrange,
                    boxShadow: '0 8px 22px rgba(249, 115, 22, 0.2)',
                  },
                }}
              >
                <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', mb: 1.25 }}>
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: 0,
                      bgcolor: c.color ? `${c.color}28` : 'rgba(249,115,22,0.2)',
                      border: `1px solid ${c.color ? `${c.color}44` : 'rgba(249,115,22,0.3)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <LocalShippingOutlinedIcon sx={{ fontSize: 16, color: c.color ?? brandColors.velocityOrange }} />
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>
                    {c.name}
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ opacity: 0.85, lineHeight: 1.6, fontSize: '0.83rem' }}>
                  {c.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
}

function EmptyNote({ text }: { text: string }) {
  return (
    <Typography variant="body2" sx={{ color: brandColors.onSurfaceVariant, fontStyle: 'italic' }}>
      {text}
    </Typography>
  );
}
