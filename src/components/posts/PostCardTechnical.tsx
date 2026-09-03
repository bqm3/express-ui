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

interface PostCardTechnicalProps {
  post: Post;
}

/**
 * PostCardTechnical Component (Variant B)
 * Horizontal Split-Panel Row Card with Left Media Container (Image or Gradient Fallback),
 * Sharp Border Accent, and Right Technical Details Panel.
 */
export default function PostCardTechnical({ post }: PostCardTechnicalProps) {
  return (
    <Card
      elevation={0}
      sx={{
        width: '100%',
        borderRadius: 0,
        bgcolor: '#ffffff',
        border: `1px solid ${brandColors.outlineVariant}`,
        borderLeft: `4px solid ${brandColors.primaryContainer}`,
        position: 'relative',
        transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-3px)',
          borderColor: brandColors.primaryContainer,
          borderLeftColor: brandColors.velocityOrange,
          boxShadow: '0 10px 28px rgba(13, 124, 102, 0.12)',
          '& .tcard-media-img': {
            transform: 'scale(1.08)',
          },
          '& .tcard-title-text': {
            color: brandColors.primaryContainer,
          },
          '& .tcard-action-arrow': {
            transform: 'translateX(6px)',
            color: brandColors.velocityOrange,
          },
        },
      }}
    >
      <CardActionArea
        component={Link}
        href={`/${post.slug}`}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'stretch',
          justifyContent: 'flex-start',
        }}
      >
        {/* Left Side Media Container: Image or Fallback Gradient Box */}
        <Box
          sx={{
            width: { xs: '100%', sm: 220, md: 250 },
            minHeight: { xs: 160, sm: 'auto' },
            flexShrink: 0,
            position: 'relative',
            overflow: 'hidden',
            bgcolor: brandColors.surfaceContainerLow,
          }}
        >
          {post.thumbnail ? (
            <Box
              className="tcard-media-img"
              sx={{
                width: '100%',
                height: '100%',
                minHeight: 160,
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
                minHeight: 160,
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
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                }}
              >
                GIA LONG LOGISTICS
              </Typography>
            </Box>
          )}
        </Box>

        {/* Right Side Content Panel */}
        <CardContent
          sx={{
            flex: 1,
            p: { xs: 2, sm: 2.25 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            {/* Meta Row: Category Tag + Date */}
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: 'center',
                mb: 1.25,
              }}
            >
              <Chip
                size="small"
                label={post.category?.name || 'TIN TỨC'}
                sx={{
                  borderRadius: 0,
                  bgcolor: brandColors.surfaceContainerLow,
                  color: brandColors.primaryContainer,
                  fontWeight: 700,
                  fontSize: '0.675rem',
                  fontFamily: brandFonts.labelCaps,
                  height: 22,
                  border: `1px solid ${brandColors.outlineVariant}`,
                }}
              />
              {post.publishedAt && (
                <Typography variant="caption" sx={{ color: brandColors.onSurfaceVariant, fontSize: '0.75rem' }}>
                  {dayjs(post.publishedAt).format('DD/MM/YYYY')}
                </Typography>
              )}
            </Stack>

            {/* Post Title */}
            <Typography
              className="tcard-title-text"
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1rem', md: '1.08rem' },
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

            {/* Post Short Description */}
            {post.shortDescription && (
              <Typography
                variant="body2"
                sx={{
                  color: brandColors.onSurfaceVariant,
                  fontSize: '0.85rem',
                  lineHeight: 1.65,
                  mb: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {post.shortDescription}
              </Typography>
            )}
          </Box>

          {/* Action Row */}
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              alignItems: 'center',
              pt: 1,
              borderTop: `1px dashed ${brandColors.outlineVariant}`,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontFamily: brandFonts.labelCaps,
                fontWeight: 700,
                color: brandColors.primaryContainer,
                letterSpacing: '0.05em',
                fontSize: '0.72rem',
              }}
            >
              XEM BÀI VIẾT
            </Typography>
            <ArrowForwardIcon
              className="tcard-action-arrow"
              sx={{
                fontSize: 14,
                color: brandColors.primaryContainer,
                transition: 'all 0.25s ease',
              }}
            />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
