import Link from 'next/link';
import { Box, Stack, Typography } from '@mui/material';
import type { Post } from '@/types';
import { brandColors } from '@/lib/theme';

interface PostCardHorizontalProps {
  post: Post;
}

export default function PostCardHorizontal({ post }: PostCardHorizontalProps) {
  return (
    <Box
      component={Link}
      href={`/${post.slug}`}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'flex-start' },
        gap: { xs: 1.5, sm: 2.5 },
        textDecoration: 'none',
        color: 'inherit',
        '&:hover .post-card-h-title': {
          color: brandColors.blueDark,
          textDecoration: 'underline',
        },
        '&:hover .post-card-h-thumb': {
          borderColor: brandColors.yellowDark,
        },
      }}
    >
      <Box
        className="post-card-h-thumb"
        sx={{
          flex: { sm: '0 0 32%' },
          width: { xs: '100%', sm: '32%' },
          maxWidth: { sm: 280 },
          aspectRatio: '4 / 3',
          border: `1px solid ${brandColors.yellow}`,
          borderRadius: 0,
          overflow: 'hidden',
          bgcolor: brandColors.mist,
          backgroundImage: post.thumbnail
            ? `url(${post.thumbnail})`
            : `linear-gradient(135deg, ${brandColors.blue} 0%, ${brandColors.blueDark} 55%, ${brandColors.yellow} 140%)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'border-color 0.2s ease',
        }}
      />

      <Stack
        spacing={1}
        sx={{
          flex: 1,
          minWidth: 0,
          pt: { sm: 0.25 },
        }}
      >
        <Typography
          className="post-card-h-title"
          component="h2"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.05rem', md: '1.2rem' },
            lineHeight: 1.35,
            color: brandColors.blueDark,
            transition: 'color 0.15s ease',
          }}
        >
          {post.title}
        </Typography>

        {post.shortDescription ? (
          <Typography
            sx={{
              color: brandColors.onSurfaceVariant,
              fontSize: { xs: '0.9rem', md: '0.95rem' },
              lineHeight: 1.65,
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.shortDescription}
          </Typography>
        ) : null}
      </Stack>
    </Box>
  );
}
