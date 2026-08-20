import Link from 'next/link';
import { Box, Grid, Stack, Typography } from '@mui/material';
import type { Post } from '@/types';
import PostCard from './PostCard';

interface PostListProps {
  posts: Post[];
  page?: number;
  totalPages?: number;
  basePath?: string;
  emptyMessage?: string;
}

export default function PostList({
  posts,
  page = 1,
  totalPages = 1,
  basePath = '/cam-nang',
  emptyMessage = 'Chưa có bài viết nào.',
}: PostListProps) {
  if (!posts.length) {
    return (
      <Box sx={{ py: 6, textAlign: "center" }}>
        <Typography sx={{
          color: "text.secondary"
        }}>{emptyMessage}</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={4}>
      <Grid container spacing={2.5}>
        {posts.map((post, idx) => (
          <Grid
            key={post.id}
            size={{ xs: 12, sm: 6 }}
            sx={{
              animation: `fadeInUp 0.6s ease ${idx * 0.08}s both`,
              '@keyframes fadeInUp': {
                from: { opacity: 0, transform: 'translateY(20px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            <PostCard post={post} />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5, flexWrap: "wrap" }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const href = p <= 1 ? basePath : `${basePath}?page=${p}`;
            const selected = p === page;
            return (
              <Box
                key={p}
                component={Link}
                href={href}
                sx={{
                  minWidth: 36,
                  height: 36,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1,
                  fontSize: 14,
                  fontWeight: selected ? 700 : 500,
                  bgcolor: selected ? 'primary.main' : 'transparent',
                  color: selected ? '#fff' : 'text.primary',
                  border: '1px solid',
                  borderColor: selected ? 'primary.main' : 'divider',
                  '&:hover': {
                    bgcolor: selected ? 'primary.dark' : 'rgba(11,110,79,0.08)',
                  },
                }}
              >
                {p}
              </Box>
            );
          })}
        </Box>
      )}
    </Stack>
  );
}
