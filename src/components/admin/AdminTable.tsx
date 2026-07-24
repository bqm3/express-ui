'use client';

import {
  Alert,
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DataTable, { type DataTableColumn } from '@/components/admin/DataTable';

export type { DataTableColumn };

export interface AdminTableFilterOption {
  label: string;
  value: string;
}

export interface AdminTableFilter {
  key: string;
  label: string;
  options: AdminTableFilterOption[];
  /** Current selected value; empty string = all */
  value: string;
}

export interface AdminTableProps<T> {
  title?: string | null;
  description?: string | null;
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string | number;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  actions?: React.ReactNode;

  /** Search (debounce ở page qua useDebounce) */
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;

  /** Dynamic filters (select) */
  filters?: AdminTableFilter[];
  onFilterChange?: (key: string, value: string) => void;

  /** Pagination */
  page?: number;
  totalPages?: number;
  total?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;

  /** Table container */
  stickyHeader?: boolean;
  minHeight?: number | string;
  maxHeight?: number | string;
  renderAfterRow?: (row: T) => React.ReactNode;
}

export default function AdminTable<T>({
  title = null,
  description = null,
  columns,
  rows,
  getRowId,
  loading = false,
  error = null,
  emptyMessage,
  actions,
  showSearch = false,
  searchPlaceholder = 'Tìm kiếm...',
  searchValue = '',
  onSearchChange,
  filters = [],
  onFilterChange,
  page = 1,
  totalPages = 1,
  total,
  pageSize,
  onPageChange,
  stickyHeader = true,
  minHeight = 360,
  maxHeight = 'calc(100vh - 280px)',
  renderAfterRow,
}: AdminTableProps<T>) {
  const hasToolbar = showSearch || filters.length > 0;
  const hasHeader = Boolean(title || description || actions);
  const safeTotalPages = Math.max(totalPages, 1);
  const totalCount = typeof total === 'number' ? total : rows.length;
  const from =
    totalCount === 0 ? 0 : (page - 1) * (pageSize || rows.length || 0) + 1;
  const to =
    totalCount === 0
      ? 0
      : Math.min(page * (pageSize || rows.length || 0), totalCount);

  return (
    <Box>
      {hasHeader ? (
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            mb: 2.5,
            justifyContent: 'space-between',
            alignItems: { sm: description ? 'flex-start' : 'center' },
          }}
        >
          {title || description ? (
            <Box>
              {title ? (
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {title}
                </Typography>
              ) : null}
              {description ? (
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    mt: title ? 0.5 : 0,
                  }}
                >
                  {description}
                </Typography>
              ) : null}
            </Box>
          ) : (
            <Box />
          )}
          {actions ? <Box sx={{ flexShrink: 0 }}>{actions}</Box> : null}
        </Stack>
      ) : null}

      {hasToolbar ? (
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1.5}
          sx={{ mb: 2 }}
        >
          {showSearch ? (
            <TextField
              size="small"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              sx={{ minWidth: { xs: '100%', md: 260 }, flex: { md: 1 } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          ) : null}

          {filters.map((filter) => (
            <FormControl
              key={filter.key}
              size="small"
              sx={{ minWidth: { xs: '100%', md: 180 } }}
            >
              <InputLabel id={`filter-${filter.key}`}>{filter.label}</InputLabel>
              <Select
                labelId={`filter-${filter.key}`}
                label={filter.label}
                value={filter.value}
                onChange={(e) =>
                  onFilterChange?.(filter.key, String(e.target.value))
                }
              >
                <MenuItem value="">
                  <em>Tất cả</em>
                </MenuItem>
                {filter.options.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
        </Stack>
      ) : null}
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}

      <Box
        sx={{
          bgcolor: 'background.paper',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: 0,
          overflow: 'hidden',
        }}
      >
        <DataTable
          columns={columns}
          rows={rows}
          getRowId={getRowId}
          stickyHeader={stickyHeader}
          minHeight={minHeight}
          maxHeight={maxHeight}
          renderAfterRow={renderAfterRow}
          emptyMessage={
            emptyMessage || (loading ? 'Đang tải...' : 'Không có dữ liệu')
          }
        />
        {onPageChange ? (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            sx={{
              px: 2,
              py: 1.5,
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              borderTop: (theme) => `1px solid ${theme.palette.divider}`,
              bgcolor: 'background.paper',
            }}
          >
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {totalCount === 0
                ? 'Không có bản ghi'
                : pageSize
                  ? `Hiển thị ${from}–${to} / Tổng ${totalCount.toLocaleString('vi-VN')} bản ghi`
                  : `Tổng ${totalCount.toLocaleString('vi-VN')} bản ghi · Trang ${page}/${safeTotalPages}`}
            </Typography>
            <Pagination
              page={page}
              count={safeTotalPages}
              color="primary"
              size="small"
              disabled={loading}
              showFirstButton
              showLastButton
              siblingCount={1}
              boundaryCount={1}
              onChange={(_, p) => onPageChange(p)}
              sx={{
                '& .MuiPagination-ul': {
                  justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                },
              }}
            />
          </Stack>
        ) : null}
      </Box>
    </Box>
  );
}
