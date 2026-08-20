import Link from 'next/link';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import type { Post } from '@/types';
import { brandColors, brandFonts } from '@/lib/theme';
import ContentWithSidebar from '@/components/layout/ContentWithSidebar';

interface PostDetailViewProps {
  post: Post;
  related_posts: Post[];
}

export default function PostDetailView({
  post,
  related_posts,
}: PostDetailViewProps) {
  return (
    <ContentWithSidebar>
      <Box
        sx={{
          p: { xs: 2, md: 3 },
          border: `1px solid ${brandColors.yellow}`,
          bgcolor: 'background.paper',
        }}
      >
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', flexWrap: 'wrap' }}
          >
            <Chip
              size="small"
              label={post.category?.name || 'Bài viết'}
              sx={{
                bgcolor: 'rgba(255, 184, 28, 0.18)',
                color: brandColors.yellowDark,
                fontWeight: 600,
                borderRadius: 0,
              }}
            />
            {post.publishedAt && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {dayjs(post.publishedAt).format('DD/MM/YYYY HH:mm')}
              </Typography>
            )}
          </Stack>

          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 800,
              color: brandColors.primaryContainer,
              fontSize: { xs: '1.65rem', md: '2.1rem' },
              lineHeight: 1.35,
              letterSpacing: '-0.01em',
            }}
          >
            {post.title}
          </Typography>

          {post.shortDescription && (
            <Typography sx={{ color: brandColors.onSurfaceVariant, fontSize: '1rem', lineHeight: 1.7 }}>
              {post.shortDescription}
            </Typography>
          )}
        </Stack>

        {post.thumbnail && (
          <Box
            component="img"
            src={post.thumbnail}
            alt={post.title}
            sx={{
              width: '100%',
              maxHeight: 420,
              objectFit: 'cover',
              borderRadius: 0,
              mb: 3,
              border: `1px solid ${brandColors.outlineVariant}`,
            }}
          />
        )}

        <Box sx={{ mb: related_posts.length ? 3 : 0 }}>
          <Box
            sx={{
              height: 2,
              bgcolor: brandColors.velocityOrange,
              mb: '3px',
            }}
          />
          <Box
            sx={{
              height: 4,
              bgcolor: brandColors.primaryContainer,
            }}
          />
          <Box
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
            sx={{
              color: brandColors.onSurface,
              p: { xs: 2.5, md: 3 },
              borderRadius: 0,
              bgcolor: '#ffffff',
              border: `1px solid ${brandColors.outlineVariant}`,
              borderTop: 'none',
              boxShadow: '0 4px 18px rgba(17, 28, 45, 0.04)',
              '& p': { mb: 2, lineHeight: 1.8, fontSize: '0.975rem' },
              '& h2, & h3, & h4': {
                fontFamily: brandFonts.headline,
                color: brandColors.primaryContainer,
                mt: 3,
                mb: 1.5,
              },
              '& img': {
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 0,
                my: 2,
              },
              '& a': { color: brandColors.primaryContainer, textDecoration: 'underline' },
              '& ul, & ol': { pl: 3, mb: 2 },
              '& blockquote': {
                borderLeft: `4px solid ${brandColors.velocityOrange}`,
                pl: 2,
                ml: 0,
                color: brandColors.onSurfaceVariant,
                fontStyle: 'italic',
              },
            }}
          />
        </Box>

        {related_posts.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, mb: 2.5, color: brandColors.yellow }}
            >
              Bài viết liên quan
            </Typography>
            <Grid container spacing={2}>
              {related_posts.map((item) => (
                <Grid key={item.id} size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      width: '100%',
                      borderRadius: 0,
                      border: `1px solid ${brandColors.border}`,
                      bgcolor: 'background.paper',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': { borderColor: brandColors.blue },
                    }}
                  >
                    <CardActionArea
                      component={Link}
                      href={`/${item.slug}`}
                      sx={{
                        height: '100%',
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        justifyContent: 'flex-start',
                      }}
                    >
                      {item.thumbnail ? (
                        <Box
                          sx={{
                            height: 120,
                            backgroundImage: `url(${item.thumbnail})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: 88,
                            background: `linear-gradient(135deg, ${brandColors.blue} 0%, ${brandColors.yellow} 140%)`,
                          }}
                        />
                      )}
                      <CardContent sx={{ py: 1.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        {item.publishedAt && (
                          <Typography
                            variant="caption"
                            sx={{ color: 'text.secondary' }}
                          >
                            {dayjs(item.publishedAt).format('DD/MM/YYYY')}
                          </Typography>
                        )}
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            mt: 0.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {item.title}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </ContentWithSidebar>
  );
}
