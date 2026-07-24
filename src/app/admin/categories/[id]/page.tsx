'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Alert, Box, CircularProgress } from '@mui/material';
import CategoryForm from '@/components/admin/CategoryForm';
import { categoriesApi } from '@/lib/api/categoriesApi';
import type { Category } from '@/types';

export default function AdminEditCategoryPage() {
  const params = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;
    categoriesApi
      .getById(Number(params.id))
      .then(setCategory)
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : 'Không tải được danh mục',
        ),
      );
  }, [params.id]);

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!category) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return <CategoryForm category={category} />;
}
