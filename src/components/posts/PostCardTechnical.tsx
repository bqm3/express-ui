// components/posts/PostCardTechnical.tsx
'use client';

import Link from 'next/link';
import { Box, Card, CardActionArea, CardContent, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { Post } from '@/types';
import { brandColors, brandFonts } from '@/lib/theme';

interface PostCardTechnicalProps {
  post: Post;
  accentColor?: string;
}

/** Horizontal card — thoáng, bo góc mềm đồng bộ ảnh + card, không còn viền trái nặng. */
export default function PostCardTechnical({ post, accentColor = '#c2410c' }: PostCardTechnicalProps) {
  return (
    <Card
      elevation={0}
      sx={{
        width: '100%',
        borderRadius: 0,
        bgcolor: '#ffffff',
        border: `1px solid rgba(194,65,12,0.14)`,
        overflow: 'hidden',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 14px 32px -16px rgba(194,65,12,0.24)',
          '& .tcard-media-img': { transform: 'scale(1.06)' },
          '& .tcard-title-text': { color: accentColor },
          '& .tcard-action-arrow': { transform: 'translateX(4px)' },
        },
      }}
    >
      <CardActionArea
        component={Link}
        href={`/${post.slug}`}
        sx={{ p: 2, display: 'block', textDecoration: 'none' }}
      >
        {/* Floated Top-Left 1/4 Corner Thumbnail */}
        <Box
          sx={{
            float: 'left',
            width: { xs: 90, sm: 110 },
            height: { xs: 90, sm: 110 },
            mr: 1.75,
            mb: 1,
            overflow: 'hidden',
            bgcolor: 'rgba(194,65,12,0.06)',
            border: `1px solid rgba(194,65,12,0.18)`,
            borderRadius: 0,
          }}
        >
          {post.thumbnail ? (
            <Box
              className="tcard-media-img"
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
                p: 1,
                textAlign: 'center',
              }}
            >
              <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontFamily: brandFonts.labelCaps, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em' }}>
                GLLOGISTICS
              </Typography>
            </Box>
          )}
        </Box>

        {/* Text Content Wrapping Directly Around Floated Image */}
        <Typography sx={{ fontFamily: brandFonts.labelCaps, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', color: accentColor, mb: 0.5 }}>
          {(post.category?.name || 'TIN TỨC').toUpperCase()}
          {post.publishedAt && (
            <Box component="span" sx={{ color: brandColors.onSurfaceVariant, fontWeight: 500, letterSpacing: 0 }}>
              {'  ·  ' + dayjs(post.publishedAt).format('DD/MM/YYYY')}
            </Box>
          )}
        </Typography>

        <Typography
          className="tcard-title-text"
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '0.95rem', md: '1.02rem' },
            lineHeight: 1.4,
            color: brandColors.onSurface,
            mb: 0.75,
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
              fontSize: '0.83rem',
              lineHeight: 1.6,
              mb: 1.25,
            }}
          >
            {post.shortDescription}
          </Typography>
        )}

        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, pt: 0.5 }}>
          <Typography sx={{ fontFamily: brandFonts.labelCaps, fontWeight: 700, color: accentColor, letterSpacing: '0.05em', fontSize: '0.72rem' }}>
            XEM BÀI VIẾT
          </Typography>
          <ArrowForwardIcon className="tcard-action-arrow" sx={{ fontSize: 13, color: accentColor, transition: 'transform 0.2s ease' }} />
        </Box>
      </CardActionArea>
    </Card>
  );
}