'use client';

import { useEffect, useState } from 'react';
import { Chip, Typography } from '@mui/material';
import dayjs from 'dayjs';
import AdminTable, {
  type DataTableColumn,
} from '@/components/admin/AdminTable';
import { trackingApi } from '@/lib/api/trackingApi';
import { useDebounce } from '@/hooks/useDebounce';
import type { Carrier, TrackingLog } from '@/types';

const carrierOptions = [
  { label: 'DHL', value: 'DHL' },
  { label: 'FedEx', value: 'FEDEX' },
  { label: 'UPS', value: 'UPS' },
];

export default function AdminTrackingLogsPage() {
  const [rows, setRows] = useState<TrackingLog[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [carrier, setCarrier] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async (
    p = 1,
    overrides?: { search?: string; carrier?: string },
  ) => {
    const nextSearch = overrides?.search ?? debouncedSearch;
    const nextCarrier = overrides?.carrier ?? carrier;

    setLoading(true);
    setError(null);
    try {
      const data = await trackingApi.logs({
        page: p,
        limit: 20,
        trackingNumber: nextSearch || undefined,
        carrier: (nextCarrier || undefined) as Carrier | undefined,
      });
      setRows(data.items);
      setPage(data.page);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1, { search: debouncedSearch });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const columns: DataTableColumn<TrackingLog>[] = [
    {
      id: 'trackingNumber',
      label: 'Mã vận đơn',
      render: (row) => (
        <Typography sx={{
          fontWeight: 600
        }}>{row.trackingNumber}</Typography>
      ),
    },
    {
      id: 'carrier',
      label: 'Hãng',
      render: (row) => (
        <Chip
          size="small"
          label={row.carrier}
          color="primary"
          variant="outlined"
        />
      ),
    },
    {
      id: 'ip',
      label: 'IP',
      render: (row) => row.ipAddress || '—',
    },
    {
      id: 'createdAt',
      label: 'Thời gian',
      render: (row) => dayjs(row.createdAt).format('DD/MM/YYYY HH:mm:ss'),
    },
  ];

  return (
    <AdminTable
      title="Tracking logs"
      description="Lịch sử tra cứu vận đơn từ phía người dùng"
      columns={columns}
      rows={rows}
      getRowId={(r) => r.id}
      loading={loading}
      error={error}
      emptyMessage={loading ? 'Đang tải...' : 'Chưa có log tra cứu'}
      showSearch
      searchPlaceholder="Tìm mã vận đơn..."
      searchValue={search}
      onSearchChange={setSearch}
      filters={[
        {
          key: 'carrier',
          label: 'Hãng',
          value: carrier,
          options: carrierOptions,
        },
      ]}
      onFilterChange={(key, value) => {
        if (key === 'carrier') {
          setCarrier(value);
          load(1, { carrier: value });
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
