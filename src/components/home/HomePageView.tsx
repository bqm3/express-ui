// components/home/HomePageView.tsx
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
import FlightTakeoffOutlinedIcon from '@mui/icons-material/FlightTakeoffOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { useRouter } from 'next/navigation';
import PostList from '@/components/posts/PostList';
import PostCardModern from '@/components/posts/PostCardModern';
import PostCardTechnical from '@/components/posts/PostCardTechnical';
import ScrollReveal from '@/components/common/ScrollReveal';
import BannerSlider from '@/components/home/BannerSlider';
import ContentSidebar from '@/components/layout/ContentSidebar';
import type { MediaItem, Post } from '@/types';
import { brandFonts } from '@/lib/theme';

const PRIMARY_COLOR = '#00614f';
const LIGHT_BG = '#f4f6f5';
const BORDER_COLOR = 'rgba(0, 97, 79, 0.16)';

/* ──────────────────── STATIC DATA ──────────────────── */

const POPULAR_DESTINATIONS = [
  { name: 'Gửi Hàng Đi Mỹ', slug: 'gui-hang-di-my' },
  { name: 'Gửi Hàng Đi Úc', slug: 'gui-hang-di-uc' },
  { name: 'Gửi Hàng Đi Canada', slug: 'gui-hang-di-canada' },
  { name: 'Gửi Hàng Đi Nhật', slug: 'gui-hang-di-nhat-ban' },
  { name: 'Gửi Hàng Đi Hàn Quốc', slug: 'gui-hang-di-han-quoc' },
  { name: 'Gửi Hàng Đi Đức', slug: 'gui-hang-di-duc' },
];

const defaultCarriers = [
  { name: 'DHL Express', desc: 'Đại lý DHL — vận chuyển hoả tốc 220+ quốc gia.' },
  { name: 'UPS Logistics', desc: 'Mạng lưới vận tải toàn cầu cam kết đúng hẹn.' },
  { name: 'FedEx Express', desc: 'Vận tải hàng không, bảo hiểm 100% hàng hoá.' },
];

/* ──────────────────── PROPS ──────────────────── */

interface HomePageViewProps {
  guiHangPosts?: Post[];
  chuyenPhatNhanhPosts?: Post[];
  camNangPosts?: Post[];
  carrierPosts?: Post[];
  recentPosts?: Post[];
  countryPosts?: Post[];
  carriers?: Array<{ name: string; desc: string }>;
  banners?: MediaItem[];
}

/* ──────────────────── MAIN COMPONENT ──────────────────── */

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
  const router = useRouter();

  // 1. Initial list assignment with fallbacks
  let initialGuiHang = guiHangPosts.length > 0 ? guiHangPosts : countryPosts;
  let initialChuyenPhat = chuyenPhatNhanhPosts.length > 0 ? chuyenPhatNhanhPosts : recentPosts;
  const camNangList = camNangPosts.length > 0 ? camNangPosts : (recentPosts.length > 0 ? recentPosts : countryPosts);

  // If one of the lists is empty, fallback to available posts from the other list
  if (initialChuyenPhat.length === 0 && initialGuiHang.length > 0) {
    initialChuyenPhat = [...initialGuiHang];
  } else if (initialGuiHang.length === 0 && initialChuyenPhat.length > 0) {
    initialGuiHang = [...initialChuyenPhat];
  }

  // 2. Strict item balancing between Chuyen Phat & Gui Hang
  const chuyenPhatList = [...initialChuyenPhat];
  const guiHangList = [...initialGuiHang];

  const total = chuyenPhatList.length + guiHangList.length;
  if (total > 0) {
    const targetForChuyenPhat = Math.ceil(total / 2);
    if (chuyenPhatList.length < targetForChuyenPhat) {
      const needed = targetForChuyenPhat - chuyenPhatList.length;
      const moved = guiHangList.splice(guiHangList.length - needed, needed);
      chuyenPhatList.push(...moved);
    } else if (guiHangList.length < (total - targetForChuyenPhat)) {
      const needed = (total - targetForChuyenPhat) - guiHangList.length;
      const moved = chuyenPhatList.splice(chuyenPhatList.length - needed, needed);
      guiHangList.push(...moved);
    }
  }

  const carrierList =
    carrierPosts.length > 0
      ? carrierPosts.map((p) => ({
        name: p.title,
        desc: p.shortDescription || p.metaDescription || '',
      }))
      : carriers && carriers.length > 0
        ? carriers
        : defaultCarriers;

  return (
    <Box sx={{ bgcolor: LIGHT_BG, minHeight: '100vh' }}>

      {/* ── 1. PORTAL HERO HEADER (Flat Solid #00614f) ─────────────────── */}
      {banners.length >= 1 ? (
        <BannerSlider banners={banners} />
      ) : (
        <PortalHeroHeader />
      )}

      {/* ── 2. QUICK DESTINATIONS & SEARCH CONTROL BAR ────────────────── */}
      <Box sx={{ bgcolor: '#ffffff', borderBottom: `1px solid ${BORDER_COLOR}`, py: 2 }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{ alignItems: { xs: 'stretch', md: 'center' }, justifyContent: 'space-between' }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <FlightTakeoffOutlinedIcon sx={{ fontSize: 18, color: PRIMARY_COLOR }} />
              <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#1a1a1a' }}>
                Tuyến phổ biến:
              </Typography>
            </Stack>

            <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
              {POPULAR_DESTINATIONS.map((dest) => (
                <Box
                  key={dest.slug}
                  component={Link}
                  href={`/${dest.slug}`}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    bgcolor: LIGHT_BG,
                    border: `1px solid ${BORDER_COLOR}`,
                    color: '#333333',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      bgcolor: PRIMARY_COLOR,
                      color: '#ffffff',
                      borderColor: PRIMARY_COLOR,
                    },
                  }}
                >
                  {dest.name}
                </Box>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* ── 3. MAIN CONTENT GRID WITH SIDEBAR ─────────────────────────── */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 5 } }}>
        <Grid container spacing={{ xs: 4, md: 4 }}>

          {/* Main Content Area */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={4}>

              {/* Company Info Banner */}
              <Box
                sx={{
                  bgcolor: '#ffffff',
                  border: `1px solid ${BORDER_COLOR}`,
                  p: 3,
                  position: 'relative',
                }}
              >
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
                  <LocationOnOutlinedIcon sx={{ fontSize: 18, color: PRIMARY_COLOR }} />
                  <Typography sx={{ fontFamily: brandFonts.labelCaps, fontWeight: 700, fontSize: '0.75rem', color: PRIMARY_COLOR, textTransform: 'uppercase' }}>
                    Công Ty TNHH Gia Long Logistics Việt Nam
                  </Typography>
                </Stack>

                <Typography sx={{ color: '#444444', fontSize: '0.92rem', lineHeight: 1.75 }}>
                  GLLOGISTICS — Chuyên gia vận chuyển hàng hóa quốc tế uy tín tại TP.HCM. Cung cấp dịch vụ gửi hàng đi Mỹ, Úc, Canada, Châu Âu và Châu Á với cước phí cạnh tranh, thủ tục hải quan trọn gói.
                </Typography>
              </Box>

              {/* Combined Services Hub: 1 Unified Shared Box Container */}
              <Box
                sx={{
                  bgcolor: '#ffffff',
                  border: `1px solid ${BORDER_COLOR}`,
                  p: { xs: 2.5, sm: 3 },
                }}
              >
                <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
                  {/* Column 1: Chuyển Phát Nhanh (Primary Teal Theme #00614f - Slides in from Left) */}
                  <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <ScrollReveal animation="fadeInLeft" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ borderBottom: `2px solid ${PRIMARY_COLOR}`, pb: 1, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: PRIMARY_COLOR, textTransform: 'uppercase' }}>
                          Chuyển Phát Nhanh
                        </Typography>
                        <Button
                          component={Link}
                          href="/chuyen-phat-nhanh"
                          endIcon={<ArrowForwardIcon className="hdr-arrow" sx={{ color: PRIMARY_COLOR, transition: 'transform 0.25s ease' }} />}
                          size="small"
                          sx={{
                            color: PRIMARY_COLOR,
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            p: 0,
                            '&:hover .hdr-arrow': { transform: 'translateX(4px)' },
                          }}
                        >
                          Xem thêm
                        </Button>
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        {chuyenPhatList.length > 0 ? (
                          <Stack spacing={2}>
                            {chuyenPhatList.map((item, idx) => (
                              <ScrollReveal key={item.id || item.slug} animation="fadeInLeft" delay={idx * 0.08}>
                                <PostCardTechnical post={item} accentColor={PRIMARY_COLOR} />
                              </ScrollReveal>
                            ))}
                          </Stack>
                        ) : (
                          <EmptyNote text="Chưa có bài viết." />
                        )}
                      </Box>

                      {/* Customer Free Consultation & Quick Quote Widget (Ocean Sapphire #0369a1 Animated Theme) */}
                      <Box
                        sx={{
                          mt: 'auto',
                          pt: 2.5,
                        }}
                      >
                        <Box
                          sx={{
                            p: 2.5,
                            bgcolor: '#0369a1',
                            border: `1px solid #0284c7`,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1.75,
                            position: 'relative',
                            overflow: 'hidden',
                            '@keyframes arrowNudge': {
                              '0%, 100%': { transform: 'translateX(0)' },
                              '50%': { transform: 'translateX(5px)' },
                            },
                            '@keyframes livePulse': {
                              '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                              '50%': { opacity: 0.4, transform: 'scale(1.3)' },
                            },
                          }}
                        >
                          <Stack
                            component={Link}
                            href="/lien-he"
                            direction="row"
                            spacing={1.25}
                            sx={{ alignItems: 'center', textDecoration: 'none', '&:hover .widget-title': { color: '#e0f2fe' } }}
                          >
                            <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                              <SupportAgentOutlinedIcon sx={{ fontSize: 24, color: '#ffffff' }} />
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: -1,
                                  right: -2,
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  bgcolor: '#22c55e',
                                  border: '1.5px solid #0369a1',
                                  animation: 'livePulse 2s ease-in-out infinite',
                                }}
                              />
                            </Box>
                            <Typography className="widget-title" sx={{ fontWeight: 800, fontSize: '0.92rem', color: '#ffffff', textTransform: 'uppercase', transition: 'color 0.2s ease', letterSpacing: '0.02em' }}>
                              Tư Vấn Miễn Phí &amp; Báo Giá Nhanh
                            </Typography>
                          </Stack>

                          <Typography sx={{ fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.95)', lineHeight: 1.65 }}>
                            Quý khách cần gửi bưu phẩm, thực phẩm hay hàng cồng kềnh đi Mỹ, Úc, Canada? Liên hệ ngay để chuyên viên GLLOGISTICS tư vấn giải pháp và báo giá cước tốt nhất sau 3 phút.
                          </Typography>

                          {/* Direct Button to /lien-he */}
                          <Button
                            component={Link}
                            href="/lien-he"
                            variant="contained"
                            fullWidth
                            endIcon={<ArrowForwardIcon sx={{ color: '#0369a1', animation: 'arrowNudge 1.6s ease-in-out infinite' }} />}
                            sx={{
                              py: 1.25,
                              bgcolor: '#ffffff',
                              color: '#0369a1',
                              fontWeight: 800,
                              fontSize: '0.82rem',
                              borderRadius: 0,
                              letterSpacing: '0.04em',
                              boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                              transition: 'all 0.25s ease',
                              '&:hover': { bgcolor: '#e0f2fe', color: '#075985', boxShadow: '0 8px 24px rgba(0,0,0,0.22)' },
                            }}
                          >
                            TƯ VẤN CƯỚC PHÍ &amp; GỬI HÀNG NGAY
                          </Button>

                          {/* Feature Checklist with Hover Micro-Interactions */}
                          <Stack spacing={0.85} sx={{ pt: 0.5 }}>
                            <Stack
                              direction="row"
                              spacing={1}
                              sx={{
                                alignItems: 'center',
                                transition: 'transform 0.2s ease',
                                cursor: 'default',
                                '&:hover': { transform: 'translateX(4px)' },
                                '&:hover .check-icon': { transform: 'scale(1.3) rotate(10deg)', color: '#ffffff' },
                              }}
                            >
                              <CheckCircleOutlinedIcon className="check-icon" sx={{ fontSize: 16, color: '#bae6fd', transition: 'transform 0.2s ease, color 0.2s ease' }} />
                              <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.95)' }}>
                                Miễn phí đóng gói thùng carton &amp; hút chân không
                              </Typography>
                            </Stack>
                            <Stack
                              direction="row"
                              spacing={1}
                              sx={{
                                alignItems: 'center',
                                transition: 'transform 0.2s ease',
                                cursor: 'default',
                                '&:hover': { transform: 'translateX(4px)' },
                                '&:hover .check-icon': { transform: 'scale(1.3) rotate(10deg)', color: '#ffffff' },
                              }}
                            >
                              <CheckCircleOutlinedIcon className="check-icon" sx={{ fontSize: 16, color: '#bae6fd', transition: 'transform 0.2s ease, color 0.2s ease' }} />
                              <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.95)' }}>
                                Lấy hàng tận nhà nội thành TP.HCM (30–60 phút)
                              </Typography>
                            </Stack>
                            <Stack
                              direction="row"
                              spacing={1}
                              sx={{
                                alignItems: 'center',
                                transition: 'transform 0.2s ease',
                                cursor: 'default',
                                '&:hover': { transform: 'translateX(4px)' },
                                '&:hover .check-icon': { transform: 'scale(1.3) rotate(10deg)', color: '#ffffff' },
                              }}
                            >
                              <CheckCircleOutlinedIcon className="check-icon" sx={{ fontSize: 16, color: '#bae6fd', transition: 'transform 0.2s ease, color 0.2s ease' }} />
                              <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.95)' }}>
                                Tra cứu mã vận đơn trực tuyến real-time 24/7
                              </Typography>
                            </Stack>
                          </Stack>
                        </Box>
                      </Box>
                    </ScrollReveal>
                  </Grid>

                  {/* Column 2: Gửi Hàng Quốc Tế (Accent Orange Theme #c2410c - Slides in from Right) */}
                  <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <ScrollReveal animation="fadeInRight" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ borderBottom: `2px solid #c2410c`, pb: 1, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#c2410c', textTransform: 'uppercase' }}>
                          Gửi Hàng Quốc Tế
                        </Typography>
                        <Button
                          component={Link}
                          href="/gui-hang-di-nuoc-ngoai"
                          endIcon={<ArrowForwardIcon className="hdr-arrow" sx={{ color: '#c2410c', transition: 'transform 0.25s ease' }} />}
                          size="small"
                          sx={{
                            color: '#c2410c',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            p: 0,
                            '&:hover .hdr-arrow': { transform: 'translateX(4px)' },
                          }}
                        >
                          Xem thêm
                        </Button>
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        {guiHangList.length > 0 ? (
                          <Stack spacing={2}>
                            {guiHangList.map((item, idx) => (
                              <ScrollReveal key={item.id || item.slug} animation="fadeInRight" delay={idx * 0.08}>
                                <PostCardModern post={item} accentColor="#c2410c" />
                              </ScrollReveal>
                            ))}
                          </Stack>
                        ) : (
                          <EmptyNote text="Chưa có bài viết." />
                        )}
                      </Box>
                    </ScrollReveal>
                  </Grid>
                </Grid>
              </Box>

              {/* Carrier Partners Block (Unique ZoomIn Staggered Animation) */}
              <ScrollReveal animation="zoomIn">
                <Box sx={{ bgcolor: '#ffffff', border: `1px solid ${BORDER_COLOR}`, p: 3 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: PRIMARY_COLOR, textTransform: 'uppercase', mb: 2, borderBottom: `2px solid ${PRIMARY_COLOR}`, pb: 1 }}>
                    Đối Tác Vận Chuyển Hàng Đầu
                  </Typography>

                  <Grid container spacing={2}>
                    {carrierList.map((c, idx) => (
                      <Grid key={c.name} size={{ xs: 12, sm: 4 }}>
                        <ScrollReveal animation="zoomIn" delay={idx * 0.1}>
                          <Box
                            sx={{
                              p: 2,
                              bgcolor: LIGHT_BG,
                              border: `1px solid ${BORDER_COLOR}`,
                              height: '100%',
                              transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                borderColor: PRIMARY_COLOR,
                                boxShadow: '0 8px 20px rgba(0,97,79,0.12)',
                              },
                            }}
                          >
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.75 }}>
                              <LocalShippingOutlinedIcon sx={{ fontSize: 18, color: PRIMARY_COLOR }} />
                              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1a1a' }}>{c.name}</Typography>
                            </Stack>
                            <Typography sx={{ fontSize: '0.8rem', color: '#555555', lineHeight: 1.5 }}>{c.desc}</Typography>
                          </Box>
                        </ScrollReveal>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </ScrollReveal>

              {/* Cẩm Nang Logistics */}
              <Box>
                <ScrollReveal animation="fadeInLeft">
                  <Box sx={{ borderBottom: `2px solid ${PRIMARY_COLOR}`, pb: 1, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: PRIMARY_COLOR, textTransform: 'uppercase' }}>
                      Cẩm Nang Kinh Nghiệm
                    </Typography>
                    <Button
                      component={Link}
                      href="/cam-nang"
                      endIcon={<ArrowForwardIcon className="hdr-arrow" sx={{ color: PRIMARY_COLOR, transition: 'transform 0.25s ease' }} />}
                      size="small"
                      sx={{
                        color: PRIMARY_COLOR,
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        p: 0,
                        '&:hover .hdr-arrow': { transform: 'translateX(4px)' },
                      }}
                    >
                      Tất cả cẩm nang
                    </Button>
                  </Box>
                </ScrollReveal>

                <PostList posts={camNangList} emptyMessage="Chưa có bài viết cẩm nang." />
              </Box>

            </Stack>
          </Grid>

          {/* Sticky Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            <ContentSidebar />
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}

/* ──────────────────── SUB-COMPONENTS ──────────────────── */

function PortalHeroHeader() {
  return (
    <Box sx={{ bgcolor: PRIMARY_COLOR, color: '#ffffff', py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 3, md: 5 }} sx={{ alignItems: 'center' }}>
          {/* Left Text */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <PublicOutlinedIcon sx={{ fontSize: 16, color: '#ffffff' }} />
                <Typography sx={{ fontFamily: brandFonts.labelCaps, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Hệ Thống Logistics Quốc Tế
                </Typography>
              </Stack>

              <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: '1.8rem', md: '2.5rem' }, lineHeight: 1.25 }}>
                Vận Chuyển Hàng Hóa Nhanh Chóng Toàn Cầu
              </Typography>

              <Typography sx={{ opacity: 0.9, fontSize: '0.95rem', lineHeight: 1.65 }}>
                Đồng hành cùng cá nhân &amp; doanh nghiệp gửi hàng đi nước ngoài an toàn, hỗ trợ đóng gói trọn gói và theo dõi lộ trình minh bạch.
              </Typography>

              <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', pt: 0.5, gap: 1 }}>
                {[
                  { icon: <VerifiedOutlinedIcon sx={{ fontSize: 16 }} />, text: 'Bảo hiểm 100%' },
                  { icon: <LocalOfferOutlinedIcon sx={{ fontSize: 16 }} />, text: 'Cước phí tối ưu' },
                  { icon: <SupportAgentOutlinedIcon sx={{ fontSize: 16 }} />, text: 'Tư vấn trọn gói' },
                ].map((item) => (
                  <Box key={item.text} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 1.5, py: 0.5, bgcolor: 'rgba(255, 255, 255, 0.12)', fontSize: '0.8rem', fontWeight: 600 }}>
                    {item.icon}
                    {item.text}
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Grid>

          {/* Right Lookup Box */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ bgcolor: '#ffffff', color: '#1a1a1a', border: `1px solid ${BORDER_COLOR}`, p: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: PRIMARY_COLOR, textTransform: 'uppercase', mb: 1 }}>
                Tra Cứu Tiến Trình Đơn Vận Chuyển
              </Typography>
              <Typography sx={{ fontSize: '0.82rem', color: '#666666', mb: 2 }}>
                Nhập mã vận đơn để nhận thông tin cập nhật lộ trình mới nhất.
              </Typography>

              <Box sx={{ border: `1px solid ${BORDER_COLOR}`, px: 2, py: 1.25, mb: 2, bgcolor: LIGHT_BG, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SearchOutlinedIcon sx={{ fontSize: 18, color: '#888888' }} />
                <Typography sx={{ fontSize: '0.85rem', color: '#888888', fontStyle: 'italic' }}>
                  Ví dụ: GLEX123456789
                </Typography>
              </Box>

              <Button
                component={Link}
                href="/tra-cuu"
                variant="contained"
                fullWidth
                endIcon={<ArrowForwardIcon />}
                sx={{
                  py: 1.25,
                  borderRadius: 0,
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  bgcolor: PRIMARY_COLOR,
                  '&:hover': { bgcolor: '#004d3e' },
                }}
              >
                Tra Cứu Đơn Hàng
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function EmptyNote({ text }: { text: string }) {
  return (
    <Typography variant="body2" sx={{ color: '#777777', fontStyle: 'italic' }}>
      {text}
    </Typography>
  );
}