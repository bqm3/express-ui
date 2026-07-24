'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Alert, CircularProgress, Box } from '@mui/material';
import PostForm from '@/components/admin/PostForm';
import { postsApi } from '@/lib/api/postsApi';
import type { Post } from '@/types';

export default function AdminEditPostPage() {
  const params = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;
    postsApi
      .getById(Number(params.id))
      .then(setPost)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Không tải được bài viết'),
      );
  }, [params.id]);

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!post) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return <PostForm post={post} />;
}
