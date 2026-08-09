import Link from 'next/link';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import type { Post } from '@/types';
import { brandColors } from '@/lib/theme';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 0,
        border: `1px solid ${brandColors.border}`,
        bgcolor: 'background.paper',
        transition: 'transform 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          borderColor: brandColors.blue,
        },
      }}
    >
      <CardActionArea
        component={Link}
        href={`/${post.slug}`}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
        }}
      >
        {post.thumbnail ? (
          <Box
            sx={{
              height: 180,
              backgroundImage: `url(${post.thumbnail})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ) : (
          <Box
            sx={{
              height: 180,
              bgcolor: '#00614f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.08em' }}>
              GLLOGISTICS
            </Typography>
          </Box>
        )}
        <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column' }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
              mb: 1
            }}>
            <Chip
              size="small"
              label={post.category?.name || 'Bài viết'}
              sx={{
                bgcolor: 'rgba(0, 97, 79, 0.08)',
                color: '#00614f',
                fontWeight: 700,
                borderRadius: 0,
              }}
            />
            {post.publishedAt && (
              <Typography variant="caption" sx={{
                color: "text.secondary"
              }}>
                {dayjs(post.publishedAt).format('DD/MM/YYYY')}
              </Typography>
            )}
          </Stack>
          <Typography
            variant="h6"
            sx={{
              fontSize: '1.02rem',
              fontWeight: 700,
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.title}
          </Typography>
          {post.shortDescription && (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontSize: '0.84rem',
                lineHeight: 1.6,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
              {post.shortDescription}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
