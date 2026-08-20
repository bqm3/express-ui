import Link from 'next/link';
import { Box, Grid, Pagination, PaginationItem, Stack, Typography } from '@mui/material';
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
          {/* <Typography sx={{ color: 'text.secondary' }}>
            {pagination.total} bài viết trong chuyên mục
          </Typography> */}
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

            {pagination.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  color="primary"
                  page={pagination.page}
                  count={pagination.totalPages}
                  renderItem={(item) => (
                    <PaginationItem
                      component={Link}
                      href={item.page === 1 ? `/${category.slug}` : `/${category.slug}?page=${item.page}`}
                      {...item}
                    />
                  )}
                />
              </Box>
            )}
          </Stack>
        )}
      </Box>
    </ContentWithSidebar>
  );
}
