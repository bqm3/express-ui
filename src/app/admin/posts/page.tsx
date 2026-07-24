'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import dayjs from 'dayjs';
import AdminTable, {
  type DataTableColumn,
} from '@/components/admin/AdminTable';
import { postsApi } from '@/lib/api/postsApi';
import { categoriesApi } from '@/lib/api/categoriesApi';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useDebounce } from '@/hooks/useDebounce';
import type { Category, Post, PostStatus } from '@/types';

const statusFilterOptions = [
  { label: 'Nháp', value: 'draft' },
  { label: 'Xuất bản', value: 'published' },
  { label: 'Lưu trữ', value: 'archived' },
];

const statusOptions: { value: PostStatus; label: string }[] = [
  { value: 'draft', label: 'Nháp' },
  { value: 'published', label: 'Xuất bản' },
  { value: 'archived', label: 'Lưu trữ' },
];

export default function AdminPostsPage() {
  const snackbar = useSnackbar();
  const [rows, setRows] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [status, setStatus] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingIds, setSavingIds] = useState<Set<number>>(new Set());

  const setSaving = (id: number, saving: boolean) => {
    setSavingIds((prev) => {
      const next = new Set(prev);
      if (saving) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const load = async (
    p = 1,
    overrides?: { search?: string; status?: string; categoryId?: string },
  ) => {
    const nextSearch = overrides?.search ?? debouncedSearch;
    const nextStatus = overrides?.status ?? status;
    const nextCategoryId = overrides?.categoryId ?? categoryId;

    setLoading(true);
    try {
      const data = await postsApi.adminList({
        page: p,
        limit: 15,
        search: nextSearch || undefined,
        status: (nextStatus || undefined) as PostStatus | undefined,
        categoryId: nextCategoryId ? Number(nextCategoryId) : undefined,
      });
      setRows(data.items);
      setPage(data.page);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      snackbar.error(
        err instanceof Error ? err.message : 'Không tải được danh sách',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    categoriesApi
      .list()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    load(1, { search: debouncedSearch });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const patchRow = async (
    id: number,
    payload: { status?: PostStatus },
  ) => {
    const prev = rows.find((r) => r.id === id);
    if (!prev) return;

    setRows((list) =>
      list.map((r) => (r.id === id ? { ...r, ...payload } : r)),
    );
    setSaving(id, true);
    try {
      const updated = await postsApi.update(id, payload);
      setRows((list) => list.map((r) => (r.id === id ? { ...r, ...updated } : r)));
      snackbar.success('Đã cập nhật');
    } catch (err) {
      setRows((list) => list.map((r) => (r.id === id ? prev : r)));
      snackbar.error(err instanceof Error ? err.message : 'Cập nhật thất bại');
    } finally {
      setSaving(id, false);
    }
  };

  const remove = async (row: Post) => {
    if (!window.confirm(`Xóa bài viết "${row.title}"?`)) return;
    setSaving(row.id, true);
    try {
      await postsApi.remove(row.id);
      snackbar.success('Đã xóa bài viết');
      await load(page);
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : 'Xóa thất bại');
    } finally {
      setSaving(row.id, false);
    }
  };

  const columns: DataTableColumn<Post>[] = [
    {
      id: 'title',
      label: 'Tiêu đề',
      minWidth: 220,
      render: (row) => (
        <Typography
          component={Link}
          href={`/admin/posts/${row.id}`}
          sx={{ fontWeight: 600, color: 'primary.main' }}
        >
          {row.title}
        </Typography>
      ),
    },
    {
      id: 'category',
      label: 'Danh mục',
      render: (row) => row.category?.name || '—',
    },
    {
      id: 'status',
      label: 'Trạng thái',
      minWidth: 140,
      render: (row) => (
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={row.status}
            disabled={savingIds.has(row.id)}
            onChange={(e) =>
              patchRow(row.id, { status: e.target.value as PostStatus })
            }
          >
            {statusOptions.map((o) => (
              <MenuItem key={o.value} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
    {
      id: 'updatedAt',
      label: 'Cập nhật',
      render: (row) => dayjs(row.updatedAt).format('DD/MM/YYYY HH:mm'),
    },
    {
      id: 'actions',
      label: 'Chức năng',
      render: (row) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Sửa">
            <IconButton
              component={Link}
              href={`/admin/posts/${row.id}`}
              size="small"
              color="primary"
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa">
            <span>
              <IconButton
                size="small"
                color="error"
                disabled={savingIds.has(row.id)}
                onClick={() => remove(row)}
              >
                <DeleteOutlinedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <AdminTable
      columns={columns}
      rows={rows}
      getRowId={(r) => r.id}
      loading={loading}
      emptyMessage={loading ? 'Đang tải...' : 'Chưa có bài viết'}
      showSearch
      searchPlaceholder="Tìm theo tiêu đề..."
      searchValue={search}
      onSearchChange={setSearch}
      filters={[
        {
          key: 'status',
          label: 'Trạng thái',
          value: status,
          options: statusFilterOptions,
        },
        {
          key: 'categoryId',
          label: 'Danh mục',
          value: categoryId,
          options: categories.map((c) => ({
            label: c.name,
            value: String(c.id),
          })),
        },
      ]}
      onFilterChange={(key, value) => {
        if (key === 'status') {
          setStatus(value);
          load(1, { status: value });
        }
        if (key === 'categoryId') {
          setCategoryId(value);
          load(1, { categoryId: value });
        }
      }}
      page={page}
      totalPages={totalPages}
      total={total}
      pageSize={15}
      onPageChange={(p) => load(p)}
      actions={
        <Button
          component={Link}
          href="/admin/posts/new"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Tạo bài viết
        </Button>
      }
    />
  );
}
