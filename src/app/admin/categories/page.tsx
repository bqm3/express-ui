'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  Chip,
  Collapse,
  IconButton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import AdminTable, {
  type DataTableColumn,
} from '@/components/admin/AdminTable';
import { categoriesApi } from '@/lib/api/categoriesApi';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useDebounce } from '@/hooks/useDebounce';
import { brandColors } from '@/lib/theme';
import type { Category } from '@/types';

const PAGE_SIZE = 15;

export default function AdminCategoriesPage() {
  const snackbar = useSnackbar();
  const [rows, setRows] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [savingIds, setSavingIds] = useState<Set<number>>(new Set());

  const setSaving = (id: number, saving: boolean) => {
    setSavingIds((prev) => {
      const next = new Set(prev);
      if (saving) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const load = async (p = 1, overrides?: { search?: string }) => {
    const nextSearch = overrides?.search ?? debouncedSearch;
    setLoading(true);
    try {
      const data = await categoriesApi.adminList({
        page: p,
        limit: PAGE_SIZE,
        search: nextSearch || undefined,
      });
      setRows(data.items);
      setPage(data.page);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      snackbar.error(
        err instanceof Error ? err.message : 'Không tải được danh mục',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1, { search: debouncedSearch });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const patchInTree = (
    list: Category[],
    id: number,
    patch: Partial<Category>,
  ): Category[] =>
    list.map((row) => {
      if (row.id === id) return { ...row, ...patch };
      if (row.children?.length) {
        return {
          ...row,
          children: row.children.map((c) =>
            c.id === id ? { ...c, ...patch } : c,
          ),
        };
      }
      return row;
    });

  const toggleMenu = async (row: Category, checked: boolean) => {
    const prev = row.showInHeaderMenu;
    setRows((list) => patchInTree(list, row.id, { showInHeaderMenu: checked }));
    setSaving(row.id, true);
    try {
      await categoriesApi.update(row.id, { showInHeaderMenu: checked });
      snackbar.success('Đã cập nhật menu header');
    } catch (err) {
      setRows((list) =>
        patchInTree(list, row.id, { showInHeaderMenu: prev }),
      );
      snackbar.error(err instanceof Error ? err.message : 'Cập nhật thất bại');
    } finally {
      setSaving(row.id, false);
    }
  };

  const toggleSidebar = async (row: Category, checked: boolean) => {
    const prev = row.showInSidebar;
    setRows((list) => patchInTree(list, row.id, { showInSidebar: checked }));
    setSaving(row.id, true);
    try {
      await categoriesApi.update(row.id, { showInSidebar: checked });
      snackbar.success('Đã cập nhật sidebar');
    } catch (err) {
      setRows((list) =>
        patchInTree(list, row.id, { showInSidebar: prev }),
      );
      snackbar.error(err instanceof Error ? err.message : 'Cập nhật thất bại');
    } finally {
      setSaving(row.id, false);
    }
  };

  const remove = async (row: Category) => {
    if (!window.confirm(`Xóa danh mục "${row.name}"?`)) return;
    try {
      await categoriesApi.remove(row.id);
      snackbar.success('Đã xóa danh mục');
      setExpanded((prev) => {
        const next = new Set(prev);
        next.delete(row.id);
        return next;
      });
      const nextPage = rows.length === 1 && page > 1 ? page - 1 : page;
      await load(nextPage);
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : 'Xóa thất bại');
    }
  };

  const renderActions = (row: Category) => (
    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
      <Tooltip title="Sửa">
        <IconButton
          size="small"
          color="primary"
          component={Link}
          href={`/admin/categories/${row.id}`}
        >
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Xóa">
        <IconButton size="small" color="error" onClick={() => remove(row)}>
          <DeleteOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );

  const columns: DataTableColumn<Category>[] = [
    {
      id: 'orderIndex',
      label: 'STT',
      render: (row) => row.orderIndex,
    },
    {
      id: 'name',
      label: 'Tên',
      minWidth: 180,
      render: (row) => (
        <Typography sx={{ fontWeight: 700 }}>{row.name}</Typography>
      ),
    },
    {
      id: 'slug',
      label: 'Slug',
      render: (row) => row.slug,
    },
    {
      id: 'childCount',
      label: 'Mục con',
      minWidth: 140,
      render: (row) => {
        const childCount = row.childCount ?? row.children?.length ?? 0;
        const isOpen = expanded.has(row.id);
        if (childCount <= 0) {
          return (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              —
            </Typography>
          );
        }
        return (
          <Chip
            size="small"
            clickable
            color={isOpen ? 'primary' : 'default'}
            variant={isOpen ? 'filled' : 'outlined'}
            label={`${childCount} mục con`}
            onClick={() => toggleExpand(row.id)}
            onDelete={() => toggleExpand(row.id)}
            deleteIcon={isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            sx={{ fontWeight: 600 }}
          />
        );
      },
    },
    {
      id: 'postCount',
      label: 'Bài viết',
      align: 'center',
      render: (row) => row.postCount ?? 0,
    },
    {
      id: 'showInHeaderMenu',
      label: 'Menu header',
      align: 'center',
      render: (row) => (
        <Tooltip title={row.showInHeaderMenu ? 'Hiện ở menu' : 'Ẩn khỏi menu'}>
          <Switch
            size="small"
            checked={Boolean(row.showInHeaderMenu)}
            disabled={savingIds.has(row.id)}
            onChange={(_, checked) => toggleMenu(row, checked)}
          />
        </Tooltip>
      ),
    },
    {
      id: 'showInSidebar',
      label: 'Sidebar',
      align: 'center',
      render: (row) => (
        <Tooltip
          title={row.showInSidebar ? 'Hiện ở sidebar' : 'Ẩn khỏi sidebar'}
        >
          <Switch
            size="small"
            checked={Boolean(row.showInSidebar)}
            disabled={savingIds.has(row.id)}
            onChange={(_, checked) => toggleSidebar(row, checked)}
          />
        </Tooltip>
      ),
    },
    {
      id: 'actions',
      label: 'Chức năng',
      align: 'right',
      render: (row) => renderActions(row),
    },
  ];

  return (
    <AdminTable
      columns={columns}
      rows={rows}
      getRowId={(r) => r.id}
      loading={loading}
      emptyMessage={loading ? 'Đang tải...' : 'Chưa có danh mục'}
      showSearch
      searchPlaceholder="Tìm theo tên / slug..."
      searchValue={search}
      onSearchChange={setSearch}
      page={page}
      totalPages={totalPages}
      total={total}
      pageSize={PAGE_SIZE}
      onPageChange={(p) => load(p)}
      actions={
        <Button
          component={Link}
          href="/admin/categories/new"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Thêm danh mục
        </Button>
      }
      renderAfterRow={(row) => {
        const children = row.children || [];
        const isOpen = expanded.has(row.id);
        if (!children.length) return null;

        return (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              sx={{ py: 0, border: 0, bgcolor: 'transparent' }}
            >
              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <Box
                  sx={{
                    my: 1,
                    mx: 1,
                    border: `1px solid ${brandColors.border}`,
                    borderRadius: 1.5,
                    overflow: 'hidden',
                    bgcolor: brandColors.mist,
                  }}
                >
                  <Box
                    sx={{
                      px: 1.5,
                      py: 1,
                      borderBottom: `1px solid ${brandColors.border}`,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        color: 'text.secondary',
                        textTransform: 'uppercase',
                        letterSpacing: 0.4,
                      }}
                    >
                      Danh mục con của “{row.name}”
                    </Typography>
                  </Box>
                  <Table size="small">
                    <TableBody>
                      {children.map((child) => (
                        <TableRow key={child.id} hover>
                          <TableCell sx={{ width: 64, pl: 2 }}>
                            <SubdirectoryArrowRightIcon
                              sx={{
                                fontSize: 16,
                                color: 'text.disabled',
                                verticalAlign: 'middle',
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ minWidth: 180 }}>
                            <Typography sx={{ fontWeight: 600 }}>
                              {child.name}
                            </Typography>
                          </TableCell>
                          <TableCell>{child.slug}</TableCell>
                          <TableCell sx={{ minWidth: 120 }}>
                            <Typography
                              variant="body2"
                              sx={{ color: 'text.secondary' }}
                            >
                              STT {child.orderIndex}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            {child.postCount ?? 0} bài
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip
                              title={
                                child.showInHeaderMenu
                                  ? 'Hiện ở menu'
                                  : 'Ẩn khỏi menu'
                              }
                            >
                              <Switch
                                size="small"
                                checked={Boolean(child.showInHeaderMenu)}
                                disabled={savingIds.has(child.id)}
                                onChange={(_, checked) =>
                                  toggleMenu(child, checked)
                                }
                              />
                            </Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip
                              title={
                                child.showInSidebar
                                  ? 'Hiện ở sidebar'
                                  : 'Ẩn khỏi sidebar'
                              }
                            >
                              <Switch
                                size="small"
                                checked={Boolean(child.showInSidebar)}
                                disabled={savingIds.has(child.id)}
                                onChange={(_, checked) =>
                                  toggleSidebar(child, checked)
                                }
                              />
                            </Tooltip>
                          </TableCell>
                          <TableCell align="right">
                            {renderActions(child)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        );
      }}
    />
  );
}
