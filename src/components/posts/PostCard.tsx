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
        sx={{ height: '100%', alignItems: 'stretch' }}
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
              height: 140,
              background: `linear-gradient(135deg, ${brandColors.blue} 0%, ${brandColors.blueDark} 55%, ${brandColors.yellow} 140%)`,
            }}
          />
        )}
        <CardContent>
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
                bgcolor: 'rgba(11, 79, 156, 0.1)',
                color: brandColors.blue,
                fontWeight: 600,
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
              fontSize: '1.05rem',
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
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
              {post.shortDescription}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
