import Link from 'next/link';
import { Box, Grid, Stack, Typography } from '@mui/material';
import type { Category, Post, ResolvePagination } from '@/types';
import { brandColors } from '@/lib/theme';
import ContentWithSidebar from '@/components/layout/ContentWithSidebar';
import PostCard from '@/components/posts/PostCard';
import PostCardHorizontal from '@/components/posts/PostCardHorizontal';

interface PostListViewProps {
  category: Category;
  posts: Post[];
  pagination: ResolvePagination;
}

function ServerPagination({
  currentPage,
  totalPages,
  categorySlug,
}: {
  currentPage: number;
  totalPages: number;
  categorySlug: string;
}) {
  if (totalPages <= 1) return null;

  const getHref = (p: number) => (p <= 1 ? `/${categorySlug}` : `/${categorySlug}?page=${p}`);

  const pages: (number | string)[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('ellipsis-start');

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push('ellipsis-end');
    pages.push(totalPages);
  }

  const btnSx = {
    minWidth: 36,
    height: 36,
    px: 1.25,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0,
    fontSize: '0.85rem',
    textDecoration: 'none',
    border: `1px solid ${brandColors.outlineVariant}`,
    transition: 'all 0.2s ease',
  };

  return (
    <Stack
      direction="row"
      spacing={0.75}
      sx={{ justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', pt: 2 }}
    >
      {currentPage > 1 && (
        <Box
          component={Link}
          href={getHref(currentPage - 1)}
          sx={{
            ...btnSx,
            bgcolor: '#ffffff',
            color: brandColors.onSurface,
            fontWeight: 600,
            '&:hover': {
              bgcolor: brandColors.surfaceContainerLow,
              borderColor: brandColors.primaryContainer,
              color: brandColors.primaryContainer,
            },
          }}
        >
          ‹ Trước
        </Box>
      )}

      {pages.map((p) => {
        if (typeof p === 'string') {
          return (
            <Box
              key={p}
              sx={{
                width: 28,
                height: 36,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: brandColors.onSurfaceVariant,
              }}
            >
              ...
            </Box>
          );
        }

        const isSelected = p === currentPage;
        return (
          <Box
            key={p}
            component={Link}
            href={getHref(p)}
            sx={{
              ...btnSx,
              fontWeight: isSelected ? 700 : 500,
              bgcolor: isSelected ? brandColors.primaryContainer : '#ffffff',
              color: isSelected ? '#ffffff' : brandColors.onSurface,
              borderColor: isSelected ? brandColors.primaryContainer : brandColors.outlineVariant,
              boxShadow: isSelected ? '0 2px 8px rgba(13, 124, 102, 0.25)' : 'none',
              '&:hover': {
                bgcolor: isSelected ? brandColors.primaryContainer : brandColors.surfaceContainerLow,
                borderColor: brandColors.primaryContainer,
                color: isSelected ? '#ffffff' : brandColors.primaryContainer,
              },
            }}
          >
            {p}
          </Box>
        );
      })}

      {currentPage < totalPages && (
        <Box
          component={Link}
          href={getHref(currentPage + 1)}
          sx={{
            ...btnSx,
            bgcolor: '#ffffff',
            color: brandColors.onSurface,
            fontWeight: 600,
            '&:hover': {
              bgcolor: brandColors.surfaceContainerLow,
              borderColor: brandColors.primaryContainer,
              color: brandColors.primaryContainer,
            },
          }}
        >
          Sau ›
        </Box>
      )}
    </Stack>
  );
}

export default function PostListView({
  category,
  posts,
  pagination,
}: PostListViewProps) {
  const useHorizontal = pagination.total > 6;

  return (
    <ContentWithSidebar>
      <Box
        sx={{
          p: { xs: 2, md: 3 },
          border: `1px solid ${brandColors.yellow}`,
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 800, color: brandColors.yellow }}
          >
            {category.shortDescription?.toUpperCase() ||
              category.name.toUpperCase()}
          </Typography>
          {category.content ? (
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  height: 2,
                  bgcolor: brandColors.yellow,
                  mb: '3px',
                }}
              />
              <Box
                sx={{
                  height: 5,
                  bgcolor: brandColors.yellow,
                }}
              />
              <Box
                className="post-content"
                sx={{
                  color: 'text.primary',
                  p: { xs: 2, md: 2.5 },
                  borderRadius: 0,
                  bgcolor: 'background.paper',
                  boxShadow: '0 4px 18px rgba(27, 41, 116, 0.12)',
                  '& .catedesc': { m: 0 },
                  '& p': { mb: 1.5 },
                  '& ul, & ol': { pl: 2.5, mb: 1.5 },
                  '& img': { maxWidth: '100%', height: 'auto' },
                }}
                dangerouslySetInnerHTML={{ __html: category.content }}
              />
            </Box>
          ) : null}
        </Box>

        {!posts.length ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography sx={{ color: 'text.secondary' }}>
              Chưa có bài viết trong chuyên mục này.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={3.5}>
            {useHorizontal ? (
              <Stack
                spacing={3}
                sx={{
                  '& > *:not(:last-child)': {
                    pb: 3,
                    borderBottom: `1px solid ${brandColors.yellow}`,
                  },
                }}
              >
                {posts.map((post) => (
                  <PostCardHorizontal key={post.id} post={post} />
                ))}
              </Stack>
            ) : (
              <Grid container spacing={2.5}>
                {posts.map((post) => (
                  <Grid key={post.id} size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                    <PostCard post={post} />
                  </Grid>
                ))}
              </Grid>
            )}

            <ServerPagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              categorySlug={category.slug}
            />
          </Stack>
        )}
      </Box>
    </ContentWithSidebar>
  );
}
