// components/posts/PostCardModern.tsx
'use client';

import Link from 'next/link';
import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import dayjs from 'dayjs';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { Post } from '@/types';
import { brandColors, brandFonts } from '@/lib/theme';

interface PostCardModernProps {
  post: Post;
  accentColor?: string;
}

/** Vertical editorial card — thoáng, bo góc mềm, không viền màu nặng. */
export default function PostCardModern({ post, accentColor = brandColors.primary }: PostCardModernProps) {
  const isOrange = accentColor === '#c2410c';
  const borderStyle = isOrange ? `1px solid rgba(194,65,12,0.14)` : `1px solid rgba(0,97,79,0.1)`;
  const shadowHoverStyle = isOrange ? '0 18px 40px -18px rgba(194,65,12,0.28)' : '0 18px 40px -18px rgba(0,97,79,0.28)';

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 0,
        bgcolor: '#ffffff',
        border: borderStyle,
        overflow: 'hidden',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: shadowHoverStyle,
          '& .card-media-img': { transform: 'scale(1.05)' },
          '& .card-title-text': { color: accentColor },
          '& .card-action-arrow': { transform: 'translateX(4px)' },
        },
      }}
    >
      <CardActionArea
        component={Link}
        href={`/${post.slug}`}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start' }}
      >
        <Box sx={{ position: 'relative', overflow: 'hidden', height: 176, bgcolor: brandColors.surfaceContainerLow }}>
          {post.thumbnail ? (
            <Box
              className="card-media-img"
              sx={{
                width: '100%',
                height: '100%',
                backgroundImage: `url(${post.thumbnail})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'transform 0.4s ease',
              }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                bgcolor: accentColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontFamily: brandFonts.labelCaps, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em' }}>
                GLLOGISTICS
              </Typography>
            </Box>
          )}
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column' }}>
          <Typography
            sx={{
              fontFamily: brandFonts.labelCaps,
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: accentColor,
              mb: 1,
            }}
          >
            {(post.category?.name || 'TIN TỨC').toUpperCase()}
            {post.publishedAt && (
              <Box component="span" sx={{ color: brandColors.onSurfaceVariant, fontWeight: 500, letterSpacing: 0 }}>
                {'  ·  ' + dayjs(post.publishedAt).format('DD/MM/YYYY')}
              </Box>
            )}
          </Typography>

          <Typography
            className="card-title-text"
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '1.02rem',
              lineHeight: 1.45,
              color: brandColors.onSurface,
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              transition: 'color 0.2s ease',
            }}
          >
            {post.title}
          </Typography>

          {post.shortDescription && (
            <Typography
              variant="body2"
              sx={{
                color: brandColors.onSurfaceVariant,
                fontSize: '0.85rem',
                lineHeight: 1.65,
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {post.shortDescription}
            </Typography>
          )}

          <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ fontFamily: brandFonts.labelCaps, fontWeight: 700, color: accentColor, fontSize: '0.72rem', letterSpacing: '0.05em' }}>
              ĐỌC TIẾP
            </Typography>
            <ArrowForwardIcon className="card-action-arrow" sx={{ fontSize: 14, color: accentColor, transition: 'transform 0.2s ease' }} />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}