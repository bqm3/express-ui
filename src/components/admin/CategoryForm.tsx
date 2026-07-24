'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { categoriesApi } from '@/lib/api/categoriesApi';
import type { Category } from '@/types';

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface CategoryFormProps {
  category?: Category;
}

export default function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const isEdit = Boolean(category);
  const [parents, setParents] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    parentId: (category?.parentId ?? '') as number | '',
    orderIndex: category?.orderIndex ?? 0,
    showInHeaderMenu: category?.showInHeaderMenu ?? false,
    showInSidebar: category?.showInSidebar ?? false,
    shortDescription: category?.shortDescription || '',
    content: category?.content || '',
  });

  useEffect(() => {
    categoriesApi
      .list()
      .then((list) =>
        setParents(list.filter((c) => c.id !== category?.id)),
      )
      .catch(() => setParents([]));
  }, [category?.id]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) {
      setError('Nhập tên và slug');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        parentId: form.parentId === '' ? null : Number(form.parentId),
        orderIndex: Number(form.orderIndex) || 0,
        showInHeaderMenu: form.showInHeaderMenu,
        showInSidebar: form.showInSidebar,
        shortDescription: form.shortDescription.trim() || null,
        content: form.content.trim() || null,
      };
      if (isEdit && category) {
        await categoriesApi.update(category.id, payload);
      } else {
        await categoriesApi.create(payload);
      }
      router.push('/admin/categories');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!category) return;
    if (!window.confirm(`Xóa danh mục "${category.name}"?`)) return;
    try {
      await categoriesApi.remove(category.id);
      router.push('/admin/categories');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xóa thất bại');
    }
  };

  return (
    <Box component="form" onSubmit={onSubmit}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ justifyContent: 'space-between', mb: 3 }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {isEdit ? 'Chỉnh sửa danh mục' : 'Thêm danh mục'}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            onClick={() => router.push('/admin/categories')}
          >
            Huỷ
          </Button>
          {isEdit && (
            <Button color="error" variant="outlined" onClick={handleDelete}>
              Xóa
            </Button>
          )}
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={2.5} sx={{ maxWidth: 960 }}>
        <TextField
          label="Tên"
          fullWidth
          value={form.name}
          onChange={(e) => {
            const name = e.target.value;
            setForm((f) => ({
              ...f,
              name,
              ...(!isEdit ? { slug: slugify(name) } : {}),
            }));
          }}
        />
        <TextField
          label="Slug"
          fullWidth
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          helperText="Chỉ a-z, 0-9 và dấu -"
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormControl fullWidth>
            <InputLabel>Danh mục cha</InputLabel>
            <Select
              label="Danh mục cha"
              value={form.parentId === '' ? '' : String(form.parentId)}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  parentId:
                    e.target.value === '' ? '' : Number(e.target.value),
                }))
              }
            >
              <MenuItem value="">— Không có —</MenuItem>
              {parents.map((c) => (
                <MenuItem key={c.id} value={String(c.id)}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Thứ tự"
            type="number"
            fullWidth
            value={form.orderIndex}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                orderIndex: Number(e.target.value) || 0,
              }))
            }
          />
        </Stack>

        <FormControlLabel
          control={
            <Switch
              checked={form.showInHeaderMenu}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  showInHeaderMenu: e.target.checked,
                }))
              }
            />
          }
          label="Hiển thị trong menu header"
        />

        <FormControlLabel
          control={
            <Switch
              checked={form.showInSidebar}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  showInSidebar: e.target.checked,
                }))
              }
            />
          }
          label="Hiển thị trong sidebar"
        />

        <TextField
          label="Mô tả ngắn"
          fullWidth
          multiline
          minRows={2}
          value={form.shortDescription}
          onChange={(e) =>
            setForm((f) => ({ ...f, shortDescription: e.target.value }))
          }
          helperText="Hiển thị dưới tiêu đề chuyên mục trên trang public"
        />

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Nội dung
          </Typography>
          <RichTextEditor
            value={form.content}
            onChange={(html) => setForm((f) => ({ ...f, content: html }))}
            placeholder="Nhập nội dung danh mục..."
            height={480}
          />
        </Box>
      </Stack>
    </Box>
  );
}
