'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AdminTable, {
  type DataTableColumn,
} from '@/components/admin/AdminTable';
import { contactChannelsApi } from '@/lib/api/contactChannelsApi';
import { contactChannelLabel } from '@/lib/contactChannel';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useDebounce } from '@/hooks/useDebounce';
import type { ContactChannel, ContactChannelType } from '@/types';

const channelOptions: { value: ContactChannelType; label: string }[] = [
  { value: 'phone', label: 'Điện thoại' },
  { value: 'zalo', label: 'Zalo' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'email', label: 'Email' },
  { value: 'other', label: 'Khác (URL)' },
];

const emptyForm = {
  name: '',
  channel: 'phone' as ContactChannelType,
  value: '',
  displayValue: '',
  orderIndex: 0,
  isActive: true,
};

export default function AdminContactChannelsPage() {
  const snackbar = useSnackbar();
  const [rows, setRows] = useState<ContactChannel[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ContactChannel | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = async (p = 1, overrides?: { search?: string }) => {
    const nextSearch = overrides?.search ?? debouncedSearch;
    setLoading(true);
    try {
      const data = await contactChannelsApi.list({
        page: p,
        limit: 20,
        search: nextSearch || undefined,
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
    load(1, { search: debouncedSearch });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      ...emptyForm,
      orderIndex: total + 1,
    });
    setOpen(true);
  };

  const openEdit = (row: ContactChannel) => {
    setEditing(row);
    setForm({
      name: row.name,
      channel: row.channel,
      value: row.value,
      displayValue: row.displayValue || '',
      orderIndex: row.orderIndex,
      isActive: row.isActive ?? true,
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.name.trim() || !form.value.trim()) {
      snackbar.error('Nhập tên và giá trị liên hệ');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        channel: form.channel,
        value: form.value.trim(),
        displayValue: form.displayValue.trim() || undefined,
        orderIndex: Number(form.orderIndex) || 0,
        isActive: form.isActive,
      };
      if (editing) {
        await contactChannelsApi.update(editing.id, payload);
        snackbar.success('Đã cập nhật');
      } else {
        await contactChannelsApi.create(payload);
        snackbar.success('Đã thêm kênh liên hệ');
      }
      setOpen(false);
      await load(page);
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (row: ContactChannel, isActive: boolean) => {
    try {
      await contactChannelsApi.update(row.id, { isActive });
      setRows((list) =>
        list.map((r) => (r.id === row.id ? { ...r, isActive } : r)),
      );
      snackbar.success('Đã cập nhật');
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : 'Cập nhật thất bại');
    }
  };

  const remove = async (row: ContactChannel) => {
    if (!window.confirm(`Xóa kênh liên hệ "${row.name}"?`)) return;
    try {
      await contactChannelsApi.remove(row.id);
      snackbar.success('Đã xóa');
      await load(page);
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : 'Xóa thất bại');
    }
  };

  const columns: DataTableColumn<ContactChannel>[] = [
    {
      id: 'orderIndex',
      label: 'STT',
      render: (row) => row.orderIndex,
    },
    {
      id: 'name',
      label: 'Tên',
      render: (row) => (
        <Typography sx={{ fontWeight: 600 }}>{row.name}</Typography>
      ),
    },
    {
      id: 'channel',
      label: 'Loại',
      render: (row) => contactChannelLabel(row.channel),
    },
    {
      id: 'value',
      label: 'Giá trị',
      render: (row) => row.displayValue || row.value,
    },
    {
      id: 'isActive',
      label: 'Hiện',
      render: (row) => (
        <Switch
          size="small"
          checked={Boolean(row.isActive)}
          onChange={(_, checked) => toggleActive(row, checked)}
        />
      ),
    },
    {
      id: 'actions',
      label: 'Chức năng',
      render: (row) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Sửa">
            <IconButton size="small" color="primary" onClick={() => openEdit(row)}>
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa">
            <IconButton size="small" color="error" onClick={() => remove(row)}>
              <DeleteOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <AdminTable
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        loading={loading}
        emptyMessage={loading ? 'Đang tải...' : 'Chưa có kênh liên hệ'}
        showSearch
        searchPlaceholder="Tìm theo tên, SĐT, URL..."
        searchValue={search}
        onSearchChange={setSearch}
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={20}
        onPageChange={(p) => load(p)}
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreate}
          >
            Thêm kênh liên hệ
          </Button>
        }
      />

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          {editing ? 'Sửa kênh liên hệ' : 'Thêm kênh liên hệ'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Tên hiển thị"
              fullWidth
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Ms. Vy / Fanpage Glex"
            />
            <FormControl fullWidth>
              <InputLabel>Loại</InputLabel>
              <Select
                label="Loại"
                value={form.channel}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    channel: e.target.value as ContactChannelType,
                  }))
                }
              >
                {channelOptions.map((o) => (
                  <MenuItem key={o.value} value={o.value}>
                    {o.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Giá trị (SĐT / URL / email)"
              fullWidth
              value={form.value}
              onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
              helperText="VD: 0907277502 · https://zalo.me/... · https://facebook.com/..."
            />
            <TextField
              label="Hiển thị (tuỳ chọn)"
              fullWidth
              value={form.displayValue}
              onChange={(e) =>
                setForm((f) => ({ ...f, displayValue: e.target.value }))
              }
              placeholder="0907.277.502"
            />
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
            <FormControlLabel
              control={
                <Switch
                  checked={form.isActive}
                  onChange={(_, checked) =>
                    setForm((f) => ({ ...f, isActive: checked }))
                  }
                />
              }
              label="Hiển thị trên website"
            />
            <Box sx={{ color: 'text.secondary', fontSize: 13 }}>
              Các kênh active sẽ hiện ở khối “Hỗ trợ khách hàng” trang chủ và
              sidebar trang nội dung.
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Huỷ</Button>
          <Button variant="contained" onClick={save} disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
