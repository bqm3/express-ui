'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddIcon from '@mui/icons-material/Add';
import AdminTable, {
  type DataTableColumn,
} from '@/components/admin/AdminTable';
import { mediaApi } from '@/lib/api/mediaApi';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useDebounce } from '@/hooks/useDebounce';
import { brandColors } from '@/lib/theme';
import type { MediaItem, MediaTypeItem } from '@/types';

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

const emptyTypeForm = { code: '', name: '', description: '' };

export default function AdminMediaPage() {
  const snackbar = useSnackbar();
  const createFileRef = useRef<HTMLInputElement>(null);
  const [types, setTypes] = useState<MediaTypeItem[]>([]);
  const [rows, setRows] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [typeFilter, setTypeFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [createFile, setCreateFile] = useState<File | null>(null);
  const [createPreview, setCreatePreview] = useState<string | null>(null);
  const [createUrl, setCreateUrl] = useState('');
  const [createTypeCode, setCreateTypeCode] = useState('');
  const [createTitle, setCreateTitle] = useState('');
  const [createAltText, setCreateAltText] = useState('');
  const [createLinkUrl, setCreateLinkUrl] = useState('');
  const [createSortOrder, setCreateSortOrder] = useState(0);
  const [createIsActive, setCreateIsActive] = useState(true);
  const [creating, setCreating] = useState(false);

  const [editRow, setEditRow] = useState<MediaItem | null>(null);
  const [title, setTitle] = useState('');
  const [altText, setAltText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [editTypeId, setEditTypeId] = useState<number | ''>('');
  const [saving, setSaving] = useState(false);

  const [typesDialogOpen, setTypesDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<MediaTypeItem | null>(null);
  const [typeForm, setTypeForm] = useState(emptyTypeForm);
  const [savingType, setSavingType] = useState(false);

  const loadTypes = async () => {
    const data = await mediaApi.types();
    setTypes(data);
    setCreateTypeCode((prev) => {
      if (prev && data.some((t) => t.code === prev)) return prev;
      return data[0]?.code || '';
    });
  };

  const load = async (
    p = 1,
    overrides?: { search?: string; type?: string; active?: string },
  ) => {
    const nextSearch = overrides?.search ?? debouncedSearch;
    const nextType = overrides?.type ?? typeFilter;
    const nextActive = overrides?.active ?? activeFilter;

    setLoading(true);
    try {
      const data = await mediaApi.list({
        page: p,
        limit: 20,
        ...(nextType ? { type: nextType } : {}),
        ...(nextActive === '1'
          ? { isActive: true }
          : nextActive === '0'
            ? { isActive: false }
            : {}),
      });
      const items = nextSearch
        ? data.items.filter((item) => {
            const q = nextSearch.toLowerCase();
            return (
              (item.title || '').toLowerCase().includes(q) ||
              (item.mediaType?.code || '').toLowerCase().includes(q) ||
              (item.mediaType?.name || '').toLowerCase().includes(q)
            );
          })
        : data.items;
      setRows(items);
      setPage(data.page);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      snackbar.error(
        err instanceof Error ? err.message : 'Không tải được media',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTypes().catch((err) => {
      snackbar.error(
        err instanceof Error ? err.message : 'Không tải được dữ liệu',
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load(1, { search: debouncedSearch });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const resetCreateForm = () => {
    setCreateFile(null);
    if (createPreview) URL.revokeObjectURL(createPreview);
    setCreatePreview(null);
    setCreateUrl('');
    setCreateTitle('');
    setCreateAltText('');
    setCreateLinkUrl('');
    setCreateSortOrder(0);
    setCreateIsActive(true);
    setCreateTypeCode(types[0]?.code || '');
    if (createFileRef.current) createFileRef.current.value = '';
  };

  const openCreate = () => {
    resetCreateForm();
    setCreateTypeCode(types[0]?.code || '');
    setCreateOpen(true);
  };

  const handleCreateFileChange = (file?: File | null) => {
    if (createPreview) URL.revokeObjectURL(createPreview);
    if (!file) {
      setCreateFile(null);
      setCreatePreview(null);
      return;
    }
    setCreateFile(file);
    setCreateUrl('');
    setCreatePreview(URL.createObjectURL(file));
    if (!createTitle.trim()) {
      setCreateTitle(file.name.replace(/\.[^.]+$/, ''));
    }
  };

  const createMedia = async () => {
    if (!createTypeCode) {
      snackbar.warning('Chọn loại media');
      return;
    }
    const externalUrl = createUrl.trim();
    if (!createFile && !externalUrl) {
      snackbar.warning('Chọn file ảnh hoặc nhập URL ảnh public');
      return;
    }

    setCreating(true);
    try {
      if (createFile) {
        await mediaApi.upload(createFile, {
          type: createTypeCode,
          title: createTitle.trim() || createFile.name,
          altText: createAltText.trim() || undefined,
          linkUrl: createLinkUrl.trim() || undefined,
          sortOrder: createSortOrder,
          isActive: createIsActive,
        });
      } else {
        await mediaApi.create({
          type: createTypeCode,
          url: externalUrl,
          title: createTitle.trim() || undefined,
          altText: createAltText.trim() || undefined,
          linkUrl: createLinkUrl.trim() || undefined,
          sortOrder: createSortOrder,
          isActive: createIsActive,
        });
      }
      snackbar.success('Tạo media thành công');
      setCreateOpen(false);
      resetCreateForm();
      await load(1);
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : 'Tạo media thất bại');
    } finally {
      setCreating(false);
    }
  };

  const openEdit = (row: MediaItem) => {
    setEditRow(row);
    setTitle(row.title || '');
    setAltText(row.altText || '');
    setImageUrl(row.url || '');
    setLinkUrl(row.linkUrl || '');
    setSortOrder(row.sortOrder);
    setIsActive(row.isActive);
    setEditTypeId(row.mediaTypeId);
  };

  const saveEdit = async () => {
    if (!editRow) return;
    if (!imageUrl.trim()) {
      snackbar.warning('URL ảnh không được để trống');
      return;
    }
    setSaving(true);
    try {
      await mediaApi.update(editRow.id, {
        title,
        altText: altText || null,
        url: imageUrl.trim(),
        linkUrl: linkUrl || null,
        sortOrder,
        isActive,
        mediaTypeId: editTypeId === '' ? undefined : Number(editTypeId),
      });
      setEditRow(null);
      snackbar.success('Cập nhật media thành công');
      await load(page);
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : 'Cập nhật thất bại');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!window.confirm('Xóa media này?')) return;
    try {
      await mediaApi.remove(id);
      snackbar.success('Đã xóa media');
      await load(page);
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : 'Xóa thất bại');
    }
  };

  const openTypesDialog = () => {
    setEditingType(null);
    setTypeForm(emptyTypeForm);
    setTypesDialogOpen(true);
  };

  const startEditType = (type: MediaTypeItem) => {
    setEditingType(type);
    setTypeForm({
      code: type.code,
      name: type.name,
      description: type.description || '',
    });
  };

  const resetTypeForm = () => {
    setEditingType(null);
    setTypeForm(emptyTypeForm);
  };

  const saveType = async () => {
    if (!typeForm.code.trim() || !typeForm.name.trim()) {
      snackbar.warning('Code và tên type là bắt buộc');
      return;
    }
    setSavingType(true);
    try {
      const payload = {
        code: typeForm.code.trim().toLowerCase().replace(/\s+/g, '-'),
        name: typeForm.name.trim(),
        description: typeForm.description.trim() || undefined,
      };
      if (editingType) {
        await mediaApi.updateType(editingType.id, payload);
        snackbar.success('Cập nhật type thành công');
      } else {
        await mediaApi.createType(payload);
        snackbar.success('Tạo type thành công');
      }
      resetTypeForm();
      await loadTypes();
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : 'Lưu type thất bại');
    } finally {
      setSavingType(false);
    }
  };

  const removeType = async (type: MediaTypeItem) => {
    if (!window.confirm(`Xóa media type "${type.name}"?`)) return;
    try {
      await mediaApi.removeType(type.id);
      snackbar.success(`Đã xóa type "${type.name}"`);
      if (editingType?.id === type.id) resetTypeForm();
      if (typeFilter === type.code) {
        setTypeFilter('');
        await load(1, { type: '' });
      }
      await loadTypes();
    } catch (err) {
      snackbar.error(
        err instanceof Error ? err.message : 'Không thể xóa type',
      );
    }
  };

  const columns: DataTableColumn<MediaItem>[] = [
    {
      id: 'preview',
      label: 'Ảnh',
      render: (row) =>
        row.mimeType?.startsWith('image/') ? (
          <Box
            component="img"
            src={row.url}
            alt={row.altText || row.title || 'media'}
            sx={{
              width: 120,
              height: 56,
              objectFit: 'cover',
              borderRadius: 0,
              border: `1px solid ${brandColors.border}`,
            }}
          />
        ) : (
          <Typography variant="caption">{row.mimeType}</Typography>
        ),
    },
    {
      id: 'title',
      label: 'Tiêu đề',
      minWidth: 160,
      render: (row) => row.title || '—',
    },
    {
      id: 'type',
      label: 'Type',
      render: (row) => (
        <Chip
          size="small"
          label={row.mediaType?.name || row.mediaType?.code || row.mediaTypeId}
          variant="outlined"
          color="primary"
        />
      ),
    },
    {
      id: 'altText',
      label: 'Alt',
      minWidth: 120,
      render: (row) => row.altText || '—',
    },
    {
      id: 'sortOrder',
      label: 'Thứ tự',
      render: (row) => row.sortOrder,
    },
    {
      id: 'size',
      label: 'Size',
      render: (row) => formatBytes(row.fileSize || 0),
    },
    {
      id: 'mimeType',
      label: 'MIME',
      render: (row) => row.mimeType || '—',
    },
    {
      id: 'linkUrl',
      label: 'Link',
      render: (row) => row.linkUrl || '—',
    },
    {
      id: 'isActive',
      label: 'Trạng thái',
      render: (row) => (
        <Chip
          size="small"
          label={row.isActive ? 'Active' : 'Ẩn'}
          color={row.isActive ? 'success' : 'default'}
        />
      ),
    },
    {
      id: 'createdAt',
      label: 'Tạo lúc',
      minWidth: 140,
      render: (row) =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleString('vi-VN')
          : '—',
    },
    {
      id: 'actions',
      label: 'Thao tác',
      render: (row) => (
        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={() => openEdit(row)}>
            Sửa
          </Button>
          <Button
            size="small"
            color="error"
            startIcon={<DeleteOutlinedIcon />}
            onClick={() => remove(row.id)}
          >
            Xóa
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <AdminTable
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        loading={loading}
        emptyMessage={loading ? 'Đang tải...' : 'Chưa có media'}
        showSearch
        searchPlaceholder="Tìm theo tiêu đề / type..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            key: 'type',
            label: 'Loại media',
            value: typeFilter,
            options: types.map((t) => ({
              label: `${t.name} (${t.code})`,
              value: t.code,
            })),
          },
          {
            key: 'active',
            label: 'Hiển thị',
            value: activeFilter,
            options: [
              { label: 'Active', value: '1' },
              { label: 'Ẩn', value: '0' },
            ],
          },
        ]}
        onFilterChange={(key, value) => {
          if (key === 'type') {
            setTypeFilter(value);
            load(1, { type: value });
          }
          if (key === 'active') {
            setActiveFilter(value);
            load(1, { active: value });
          }
        }}
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={20}
        onPageChange={(p) => load(p)}
        actions={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              variant="outlined"
              startIcon={<CategoryOutlinedIcon />}
              onClick={openTypesDialog}
            >
              Quản lý type
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreate}
            >
              Tạo mới
            </Button>
          </Stack>
        }
      />

      <Dialog
        open={createOpen}
        onClose={() => {
          if (creating) return;
          setCreateOpen(false);
          resetCreateForm();
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Tạo media mới</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                Ảnh (chọn file hoặc dán URL public)
              </Typography>
              <input
                ref={createFileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                hidden
                onChange={(e) => handleCreateFileChange(e.target.files?.[0])}
              />
              <Button
                variant="outlined"
                startIcon={<CloudUploadOutlinedIcon />}
                onClick={() => createFileRef.current?.click()}
                fullWidth
              >
                {createFile ? 'Đổi file ảnh' : 'Upload file ảnh'}
              </Button>
              <TextField
                label="URL ảnh (url)"
                value={createUrl}
                onChange={(e) => {
                  const next = e.target.value;
                  setCreateUrl(next);
                  if (next.trim() && createFile) {
                    if (createPreview) URL.revokeObjectURL(createPreview);
                    setCreateFile(null);
                    setCreatePreview(null);
                    if (createFileRef.current) createFileRef.current.value = '';
                  }
                }}
                fullWidth
                placeholder="https://cdn.example.com/banner.jpg"
                helperText="Dùng link public bên ngoài nếu không upload file"
                sx={{ mt: 1.5 }}
                disabled={Boolean(createFile)}
              />
              {(createPreview || createUrl.trim()) && (
                <Box
                  component="img"
                  src={createPreview || createUrl.trim()}
                  alt="Preview"
                  sx={{
                    mt: 1.5,
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'cover',
                    border: `1px solid ${brandColors.border}`,
                  }}
                />
              )}
              {createFile && (
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}
                >
                  {createFile.name} · {formatBytes(createFile.size)}
                </Typography>
              )}
            </Box>

            <FormControl fullWidth required>
              <InputLabel id="create-type">Loại media (type)</InputLabel>
              <Select
                labelId="create-type"
                label="Loại media (type)"
                value={createTypeCode}
                onChange={(e) => setCreateTypeCode(String(e.target.value))}
              >
                {types.map((t) => (
                  <MenuItem key={t.id} value={t.code}>
                    {t.name} ({t.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Tiêu đề (title)"
              value={createTitle}
              onChange={(e) => setCreateTitle(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Alt text (altText)"
              value={createAltText}
              onChange={(e) => setCreateAltText(e.target.value)}
              fullWidth
            />
            <TextField
              label="Link khi click (linkUrl)"
              value={createLinkUrl}
              onChange={(e) => setCreateLinkUrl(e.target.value)}
              fullWidth
              placeholder="https://..."
            />
            <TextField
              label="Thứ tự (sortOrder)"
              type="number"
              value={createSortOrder}
              onChange={(e) => setCreateSortOrder(Number(e.target.value) || 0)}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={createIsActive}
                  onChange={(e) => setCreateIsActive(e.target.checked)}
                />
              }
              label="Hiển thị (isActive)"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setCreateOpen(false);
              resetCreateForm();
            }}
            disabled={creating}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={createMedia}
            disabled={creating || (!createFile && !createUrl.trim()) || !createTypeCode}
            startIcon={
              creating ? <CircularProgress size={16} color="inherit" /> : <AddIcon />
            }
          >
            {creating ? 'Đang tạo...' : 'Tạo media'}
          </Button>
        </DialogActions>
      </Dialog>      <Dialog
        open={typesDialogOpen}
        onClose={() => {
          setTypesDialogOpen(false);
          resetTypeForm();
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Quản lý media type</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <Box
              sx={{
                border: `1px solid ${brandColors.border}`,
                bgcolor: brandColors.surfaceLowest,
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Tên</TableCell>
                    <TableCell>Mô tả</TableCell>
                    <TableCell align="right" width={120}>
                      Thao tác
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {types.map((t) => (
                    <TableRow
                      key={t.id}
                      selected={editingType?.id === t.id}
                      hover
                    >
                      <TableCell>
                        <Typography
                          sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                        >
                          {t.code}
                        </Typography>
                      </TableCell>
                      <TableCell>{t.name}</TableCell>
                      <TableCell>{t.description || '—'}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          aria-label="Sửa type"
                          onClick={() => startEditType(t)}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          aria-label="Xóa type"
                          onClick={() => removeType(t)}
                        >
                          <DeleteOutlinedIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!types.length && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Typography variant="body2" sx={{
                          color: "text.secondary"
                        }}>
                          Chưa có media type
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>

            <Divider />

            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {editingType ? `Sửa type: ${editingType.name}` : 'Thêm type mới'}
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Code"
                placeholder="banner"
                value={typeForm.code}
                onChange={(e) =>
                  setTypeForm((prev) => ({ ...prev, code: e.target.value }))
                }
                helperText="Viết thường, không dấu, dùng dấu -"
                fullWidth
                required
                disabled={Boolean(editingType)}
              />
              <TextField
                label="Tên hiển thị"
                placeholder="Banner"
                value={typeForm.name}
                onChange={(e) =>
                  setTypeForm((prev) => ({ ...prev, name: e.target.value }))
                }
                fullWidth
                required
              />
              <TextField
                label="Mô tả"
                value={typeForm.description}
                onChange={(e) =>
                  setTypeForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                fullWidth
                multiline
                minRows={2}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          {editingType ? (
            <Button onClick={resetTypeForm} sx={{ mr: 'auto' }}>
              Hủy sửa
            </Button>
          ) : (
            <Box sx={{ mr: 'auto' }} />
          )}
          <Button
            onClick={() => {
              setTypesDialogOpen(false);
              resetTypeForm();
            }}
          >
            Đóng
          </Button>
          <Button
            variant="contained"
            startIcon={editingType ? undefined : <AddIcon />}
            onClick={saveType}
            disabled={savingType}
          >
            {savingType
              ? 'Đang lưu...'
              : editingType
                ? 'Lưu type'
                : 'Thêm type'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={Boolean(editRow)}
        onClose={() => setEditRow(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Sửa media</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {imageUrl && (
              <Box
                component="img"
                src={imageUrl}
                alt={altText || title || 'media'}
                sx={{
                  width: '100%',
                  maxHeight: 200,
                  objectFit: 'cover',
                  border: `1px solid ${brandColors.border}`,
                }}
              />
            )}
            <TextField
              label="URL ảnh (url)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              fullWidth
              required
              helperText="Có thể dùng link public bên ngoài"
              placeholder="https://..."
            />
            <TextField
              label="Storage key"
              value={editRow?.storageKey || ''}
              fullWidth
              slotProps={{ input: { readOnly: true } }}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="MIME type"
                value={editRow?.mimeType || ''}
                fullWidth
                slotProps={{ input: { readOnly: true } }}
              />
              <TextField
                label="File size"
                value={formatBytes(editRow?.fileSize || 0)}
                fullWidth
                slotProps={{ input: { readOnly: true } }}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Created at"
                value={
                  editRow?.createdAt
                    ? new Date(editRow.createdAt).toLocaleString('vi-VN')
                    : '—'
                }
                fullWidth
                slotProps={{ input: { readOnly: true } }}
              />
              <TextField
                label="Updated at"
                value={
                  editRow?.updatedAt
                    ? new Date(editRow.updatedAt).toLocaleString('vi-VN')
                    : '—'
                }
                fullWidth
                slotProps={{ input: { readOnly: true } }}
              />
            </Stack>
            <TextField
              label="Created by (user id)"
              value={editRow?.createdBy ?? '—'}
              fullWidth
              slotProps={{ input: { readOnly: true } }}
            />

            <Divider />

            <TextField
              label="Tiêu đề (title)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />
            <TextField
              label="Alt text (altText)"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="edit-type">Loại media (mediaTypeId)</InputLabel>
              <Select
                labelId="edit-type"
                label="Loại media (mediaTypeId)"
                value={editTypeId}
                onChange={(e) => setEditTypeId(Number(e.target.value))}
              >
                {types.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.name} ({t.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Link khi click (linkUrl)"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              fullWidth
            />
            <TextField
              label="Thứ tự (sortOrder)"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
              }
              label="Hiển thị (isActive)"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditRow(null)}>Hủy</Button>
          <Button variant="contained" onClick={saveEdit} disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
