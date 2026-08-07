'use client';

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
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { Post } from '@/types';
import { brandColors, brandFonts } from '@/lib/theme';

interface PostCardModernProps {
  post: Post;
}

/**
 * PostCardModern Component (Variant A)
 * Vertical Editorial / Magazine Style with Top Media Header, Overlaid Category Chip,
 * and Bottom Dashed Action Bar.
 */
export default function PostCardModern({ post }: PostCardModernProps) {
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 0,
        bgcolor: '#ffffff',
        border: `1px solid ${brandColors.outlineVariant}`,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: brandColors.primaryContainer,
          boxShadow: '0 12px 30px rgba(13, 124, 102, 0.12)',
          '& .card-media-img': {
            transform: 'scale(1.06)',
          },
          '& .card-title-text': {
            color: brandColors.primaryContainer,
          },
          '& .card-action-arrow': {
            transform: 'translateX(5px)',
            color: brandColors.velocityOrange,
          },
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
        {/* Top Media Header: Thumbnail or Fallback Gradient Box */}
        <Box sx={{ position: 'relative', overflow: 'hidden', height: 180, bgcolor: brandColors.surfaceContainerLow }}>
          {post.thumbnail ? (
            <Box
              className="card-media-img"
              sx={{
                width: '100%',
                height: '100%',
                backgroundImage: `url(${post.thumbnail})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                background: `linear-gradient(135deg, ${brandColors.forestDeep} 0%, ${brandColors.primaryContainer} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
              }}
            >
              <Typography
                sx={{
                  color: 'rgba(255, 255, 255, 0.35)',
                  fontFamily: brandFonts.labelCaps,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                }}
              >
                GLLOGISTICS
              </Typography>
            </Box>
          )}

          {/* Overlaid Category Tag */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              zIndex: 2,
            }}
          >
            <Chip
              size="small"
              label={post.category?.name || 'TIN TỨC'}
              sx={{
                borderRadius: 0,
                bgcolor: brandColors.primaryContainer,
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.675rem',
                fontFamily: brandFonts.labelCaps,
                height: 22,
                letterSpacing: '0.04em',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
            />
          </Box>
        </Box>

        {/* Content Body */}
        <CardContent
          sx={{
            flexGrow: 1,
            p: 2.25,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {post.publishedAt && (
            <Typography
              variant="caption"
              sx={{
                color: brandColors.onSurfaceVariant,
                fontSize: '0.75rem',
                fontWeight: 500,
                mb: 1,
              }}
            >
              Đăng ngày: {dayjs(post.publishedAt).format('DD/MM/YYYY')}
            </Typography>
          )}

          <Typography
            className="card-title-text"
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '1rem',
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
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {post.shortDescription}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
