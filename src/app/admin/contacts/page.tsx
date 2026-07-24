'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Chip,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import AdminTable, {
  type DataTableColumn,
} from '@/components/admin/AdminTable';
import { contactApi } from '@/lib/api/contactApi';
import { useDebounce } from '@/hooks/useDebounce';
import type { ContactRequest, ContactStatus } from '@/types';

const statusOptions: ContactStatus[] = ['new', 'processing', 'done', 'spam'];

export default function AdminContactsPage() {
  const [rows, setRows] = useState<ContactRequest[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async (
    p = 1,
    overrides?: { search?: string; status?: string },
  ) => {
    const nextSearch = overrides?.search ?? debouncedSearch;
    const nextStatus = overrides?.status ?? status;

    setLoading(true);
    setError(null);
    try {
      const data = await contactApi.list({
        page: p,
        limit: 20,
        search: nextSearch || undefined,
        status: (nextStatus || undefined) as ContactStatus | undefined,
      });
      setRows(data.items);
      setPage(data.page);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được danh sách');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1, { search: debouncedSearch });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const updateStatus = async (id: number, next: ContactStatus) => {
    try {
      await contactApi.update(id, { status: next });
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: next } : r)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cập nhật thất bại');
    }
  };

  const columns: DataTableColumn<ContactRequest>[] = [
    {
      id: 'fullName',
      label: 'Họ tên',
      render: (row) => (
        <Box>
          <Typography sx={{
            fontWeight: 600
          }}>{row.fullName}</Typography>
          <Typography variant="caption" sx={{
            color: "text.secondary"
          }}>
            {row.email} · {row.phone}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'subject',
      label: 'Tiêu đề',
      minWidth: 180,
      render: (row) => row.subject,
    },
    {
      id: 'status',
      label: 'Trạng thái',
      render: (row) => (
        <Select
          size="small"
          value={row.status}
          onChange={(e) =>
            updateStatus(row.id, e.target.value as ContactStatus)
          }
        >
          {statusOptions.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>
      ),
    },
    {
      id: 'createdAt',
      label: 'Ngày gửi',
      render: (row) => (
        <Chip
          size="small"
          label={dayjs(row.createdAt).format('DD/MM/YYYY HH:mm')}
          variant="outlined"
        />
      ),
    },
  ];

  return (
    <AdminTable
      title="Yêu cầu liên hệ"
      columns={columns}
      rows={rows}
      getRowId={(r) => r.id}
      loading={loading}
      error={error}
      emptyMessage={loading ? 'Đang tải...' : 'Chưa có yêu cầu liên hệ'}
      showSearch
      searchPlaceholder="Tìm theo tên, email, SĐT..."
      searchValue={search}
      onSearchChange={setSearch}
      filters={[
        {
          key: 'status',
          label: 'Trạng thái',
          value: status,
          options: statusOptions.map((s) => ({ label: s, value: s })),
        },
      ]}
      onFilterChange={(key, value) => {
        if (key === 'status') {
          setStatus(value);
          load(1, { status: value });
        }
      }}
      page={page}
      totalPages={totalPages}
      total={total}
      pageSize={20}
      onPageChange={(p) => load(p)}
    />
  );
}
