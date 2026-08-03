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
import PostList from '@/components/posts/PostList';
import BannerSlider from '@/components/home/BannerSlider';
import ContentSidebar from '@/components/layout/ContentSidebar';
import type { MediaItem, Post } from '@/types';
import { brandColors } from '@/lib/theme';

const countryServices = [
  { title: 'Gửi hàng đi Anh Quốc', desc: 'Thực phẩm, quà biếu, chứng từ đi UK từ TP.HCM — giá cạnh tranh.' },
  { title: 'Gửi hàng đi Nga', desc: 'Chuyên tuyến TP.HCM — Nga, tiết kiệm chi phí đến 40%.' },
  { title: 'Gửi hàng đi Thái Lan', desc: 'Bangkok, Chiang Mai — 2–5 ngày, nhận hàng tận nơi.' },
  { title: 'Gửi hàng đi Malaysia', desc: 'Trọn gói thủ tục, giao tận tay tại Malaysia.' },
  { title: 'Chuyển phát nhanh đi Úc', desc: 'Chứng từ, hải sản khô, hàng cồng kềnh đến Australia.' },
  { title: 'Gửi hàng đi Hàn Quốc', desc: 'Ship hàng Hàn Quốc qua DHL, TNT, UPS giá rẻ.' },
];

const overseasServices = [
  { title: 'Gửi hàng đi Ấn Độ', desc: 'Báo giá rõ ràng tại TP.HCM, bao thủ tục — thuế phí.' },
  { title: 'Gửi hàng đi Úc giá rẻ', desc: 'Hồ sơ, hàng mẫu, máy móc — tư vấn hải quan.' },
  { title: 'Thực phẩm đi Châu Âu', desc: 'Đóng gói chuyên nghiệp, thông quan thực phẩm EU.' },
  { title: 'Thực phẩm đi Đức', desc: 'Đồ khô, bánh kẹo gửi người thân tại Đức.' },
  { title: 'Thu mua hộ gửi Mỹ', desc: 'Thu mua + đóng gói + gửi đi Mỹ giúp khách hàng.' },
  { title: 'Gửi hàng đi Mỹ', desc: 'Khô hải sản, thủ công mỹ nghệ biếu tặng / kinh doanh.' },
];

const carriers = [
  { name: 'DHL', desc: 'Đại lý DHL — dịch vụ quốc tế nhanh, hỗ trợ tiện ích đầy đủ.' },
  { name: 'UPS', desc: 'Cam kết đúng thời gian với mạng lưới logistics toàn cầu.' },
  { name: 'FedEx', desc: 'Phủ sóng 220+ quốc gia, mạng lưới hàng không mạnh.' },
];

interface HomePageViewProps {
  recentPosts: Post[];
  countryPosts: Post[];
  banners?: MediaItem[];
}

export default function HomePageView({
  recentPosts,
  countryPosts,
  banners = [],
}: HomePageViewProps) {
  const serviceCards =
    countryPosts.length > 0
      ? countryPosts.map((p) => ({
          title: p.title,
          desc: p.shortDescription || '',
          href: `/${p.slug}`,
        }))
      : countryServices.map((s) => ({
          ...s,
          href: '/gui-hang-di-nuoc-ngoai',
        }));

  const hasBanners = banners.length >= 1;

  return (
    <>
      {hasBanners ? (
        <BannerSlider banners={banners} />
      ) : (
        <Box
          sx={{
            position: 'relative',
            minHeight: { xs: 320, md: 420 },
            display: 'flex',
            alignItems: 'center',
            background: `
            linear-gradient(105deg, rgba(27,41,116,0.94) 0%, rgba(52,65,140,0.88) 55%, rgba(38,48,102,0.92) 100%),
            linear-gradient(180deg, ${brandColors.primaryContainer}, ${brandColors.primary})
          `,
            color: '#fff',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: 380,
              height: 380,
              borderRadius: '50%',
              right: { xs: -100, md: '5%' },
              top: { xs: '40%', md: '-10%' },
              background:
                'radial-gradient(circle, rgba(255,184,28,0.35), transparent 70%)',
            }}
          />
          <Container maxWidth="lg" sx={{ position: 'relative', py: { xs: 5, md: 7 } }}>
            <Stack spacing={2} sx={{ maxWidth: 640 }}>
              <Typography
                sx={{
                  fontFamily:
                    'var(--font-hanken-grotesk), "Hanken Grotesk", sans-serif',
                  fontWeight: 800,
                  fontSize: { xs: '1.75rem', md: '2.5rem' },
                  lineHeight: 1.15,
                }}
              >
                Dịch vụ gửi hàng đi nước ngoài uy tín — giá rẻ TP.HCM
              </Typography>
              <Typography
                sx={{
                  opacity: 0.9,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.7,
                }}
              >
                GLOBAL LIGHT EXPRESS — chuyển phát nhanh Ánh Sáng Toàn Cầu. Nhanh
                chóng, an toàn, chất lượng.
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                sx={{ pt: 1 }}
              >
                <Button
                  component={Link}
                  href="/tra-cuu"
                  variant="contained"
                  color="secondary"
                  size="large"
                  startIcon={<SearchOutlinedIcon />}
                  sx={{ fontWeight: 800 }}
                >
                  Tra cứu đơn vận chuyển
                </Button>
                <Button
                  component={Link}
                  href="/lien-he"
                  variant="outlined"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: '#fff',
                    '&:hover': {
                      borderColor: brandColors.yellow,
                      bgcolor: 'rgba(255,184,28,0.12)',
                    },
                  }}
                >
                  Liên hệ tư vấn
                </Button>
              </Stack>
            </Stack>
          </Container>
        </Box>
      )}

      <Box sx={{ bgcolor: brandColors.yellow, py: 2 }}>
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            {[
              { icon: <VerifiedOutlinedIcon />, text: 'Uy tín & Chất lượng' },
              { icon: <LocalOfferOutlinedIcon />, text: 'Giá cả cạnh tranh' },
              {
                icon: <SupportAgentOutlinedIcon />,
                text: 'Nhiệt tình & chu đáo',
              },
            ].map((item) => (
              <Grid key={item.text} size={{ xs: 12, md: 4 }}>
                <Stack
                  direction="row"
                  spacing={1.25}
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: brandColors.navy,
                    fontWeight: 700,
                  }}
                >
                  {item.icon}
                  <Typography sx={{ fontWeight: 700 }}>{item.text}</Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={{ xs: 4, md: 5 }}>
              <Box
                className="home-intro"
                sx={{
                  bgcolor: '#ffba00',
                  color: '#1a1a1a',
                  p: { xs: 2.5, md: 3 },
                  borderRadius: 2,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                }}
              >
                <Box className="introbrief">
                  <Box className="tit">
                    <Typography
                      variant="h4"
                      component="h2"
                      sx={{
                        mb: 1.5,
                        color: '#1b2974',
                        fontWeight: 800,
                        fontSize: { xs: '1.25rem', md: '1.5rem' },
                        lineHeight: 1.3,
                      }}
                    >
                      Giới thiệu công ty chuyển phát nhanh Ánh Sáng Toàn Cầu
                    </Typography>
                  </Box>
                  <Box className="dtext">
                    <Typography
                      component="p"
                      sx={{
                        color: '#222222',
                        fontSize: { xs: '0.925rem', md: '0.975rem' },
                        lineHeight: 1.75,
                      }}
                    >
                      GLOBAL LIGHT EXPRESS - chúng tôi chuyên vận chuyển hàng hóa đi nước ngoài và nhập hàng ở tất cả các nước về Việt Nam bằng đường hàng không. Nhận vận chuyển các loại hàng hóa đặc biệt như Mỹ Phẩm, thuốc tây, thuốc nam, hàng hóa cồng kềnh, quá khổ...với dịch vụ chất lượng và giá thành rẻ để phục vụ quý khách hàng có nhu cầu gửi thư từ và hàng hóa di China, Hong Kong, Singapore, Malaysia, Campuchia, Thailand
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ mb: 3, color: brandColors.blue, fontWeight: 800 }}
                >
                  Dịch vụ chuyển phát nhanh
                </Typography>
                <Grid container spacing={2.5}>
                  {serviceCards.map((item) => (
                    <Grid key={item.title} size={{ xs: 12, sm: 6 }}>
                      <Box
                        component={Link}
                        href={item.href}
                        sx={{
                          display: 'block',
                          height: '100%',
                          p: 2.5,
                          border: `1px solid ${brandColors.border}`,
                          borderTop: `3px solid ${brandColors.blue}`,
                          bgcolor: brandColors.offWhite,
                          transition: 'border-color 0.2s, box-shadow 0.2s',
                          '&:hover': {
                            borderColor: brandColors.blue,
                            boxShadow: '0 4px 16px rgba(11,79,156,0.12)',
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 700,
                            mb: 1,
                            color: brandColors.blue,
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            lineHeight: 1.7,
                          }}
                        >
                          {item.desc}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Box>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ mb: 3, color: brandColors.blue, fontWeight: 800 }}
                >
                  Dịch vụ gửi hàng nước ngoài
                </Typography>
                <Grid container spacing={2.5}>
                  {overseasServices.map((item) => (
                    <Grid key={item.title} size={{ xs: 12, sm: 6 }}>
                      <Box
                        component={Link}
                        href="/lien-he"
                        sx={{
                          display: 'block',
                          height: '100%',
                          p: 2.5,
                          bgcolor: '#fff',
                          border: `1px solid ${brandColors.border}`,
                          '&:hover': { borderColor: brandColors.yellow },
                        }}
                      >
                        <Typography sx={{ fontWeight: 700, mb: 1 }}>
                          {item.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary' }}
                        >
                          {item.desc}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Box
                sx={{
                  bgcolor: brandColors.blue,
                  color: '#fff',
                  p: { xs: 2.5, md: 3 },
                }}
              >
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ mb: 3, fontWeight: 800 }}
                >
                  Dịch vụ chuyển phát nhanh Quốc tế uy tín
                </Typography>
                <Grid container spacing={2.5}>
                  {carriers.map((c) => (
                    <Grid key={c.name} size={{ xs: 12, sm: 6, md: 4 }}>
                      <Stack
                        spacing={1.5}
                        sx={{
                          p: 2.5,
                          height: '100%',
                          bgcolor: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.15)',
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ alignItems: 'center' }}
                        >
                          <LocalShippingOutlinedIcon
                            sx={{ color: brandColors.yellow }}
                          />
                          <Typography
                            sx={{ fontWeight: 800, fontSize: '1.15rem' }}
                          >
                            {c.name}
                          </Typography>
                        </Stack>
                        <Typography
                          variant="body2"
                          sx={{ opacity: 0.9, lineHeight: 1.7 }}
                        >
                          {c.desc}
                        </Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Box>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: { sm: 'flex-end' },
                    mb: 3,
                  }}
                >
                  <Box>
                    <Typography
                      variant="overline"
                      sx={{ color: brandColors.blue, fontWeight: 700 }}
                    >
                      Cẩm nang hỗ trợ
                    </Typography>
                    <Typography
                      variant="h5"
                      component="h2"
                      color={brandColors.blue}
                      sx={{ fontWeight: 800 }}
                    >
                      Chia sẻ kinh nghiệm gửi hàng
                    </Typography>
                  </Box>
                  <Button
                    component={Link}
                    href="/cam-nang"
                    endIcon={<ArrowForwardIcon />}
                  >
                    Xem tất cả
                  </Button>
                </Stack>
                <PostList
                  posts={recentPosts}
                  emptyMessage="Chưa có bài viết. Hãy quay lại sau."
                />
              </Box>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <ContentSidebar />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
