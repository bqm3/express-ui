'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyIcon from '@mui/icons-material/Key';
import AdminTable, { type DataTableColumn } from '@/components/admin/AdminTable';
import { User, AdminRole, CreateUserDto, UpdateUserDto, ChangePasswordDto } from '@/types';
import { usersApi } from '@/lib/api/usersApi';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useDebounce } from '@/hooks/useDebounce';
import UserForm from '@/components/admin/users/UserForm';
import ChangePasswordForm from '@/components/admin/users/ChangePasswordForm';
import { brandColors } from '@/lib/theme';

import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/authApi';

export default function AdminUsersPage() {
  const router = useRouter();
  const snackbar = useSnackbar();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [passwordFormOpen, setPasswordFormOpen] = useState(false);
  const [passwordUser, setPasswordUser] = useState<User | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [roleFilter, setRoleFilter] = useState('');

  const load = async (
    p = 1,
    overrides?: { search?: string; role?: string },
  ) => {
    const nextSearch = overrides?.search ?? debouncedSearch;
    const nextRole = overrides?.role ?? roleFilter;

    try {
      setLoading(true);
      const data = await usersApi.getAll({
        page: p,
        limit: 15,
        search: nextSearch || undefined,
        role: nextRole || undefined,
      });
      setUsers(data.items);
      setPage(data.page);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err: any) {
      snackbar.error(err.message || 'Lỗi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1, { search: debouncedSearch });
  }, [debouncedSearch]);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormOpen(true);
  };

  const handleOpenPassword = (user: User) => {
    setPasswordUser(user);
    setPasswordFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingUser(null);
  };

  const handleClosePasswordForm = () => {
    setPasswordFormOpen(false);
    setPasswordUser(null);
  };

  const handleSubmit = async (data: CreateUserDto | UpdateUserDto) => {
    try {
      setSubmitting(true);
      if (editingUser) {
        await usersApi.update(editingUser.id, data as UpdateUserDto);
        snackbar.success('Cập nhật thành công');
      } else {
        await usersApi.create(data as CreateUserDto);
        snackbar.success('Thêm tài khoản thành công');
      }
      handleCloseForm();
      load(page);
    } catch (error: any) {
      snackbar.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (data: ChangePasswordDto) => {
    if (!passwordUser) return;
    try {
      setSubmitting(true);
      await usersApi.changePassword(passwordUser.id, data);
      snackbar.success('Đổi mật khẩu thành công');
      handleClosePasswordForm();
    } catch (error: any) {
      snackbar.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa tài khoản này không?')) return;
    try {
      await usersApi.delete(id);
      snackbar.success('Đã xóa tài khoản');
      load(page);
    } catch (error: any) {
      snackbar.error(error.message || 'Xóa thất bại');
    }
  };

  const columns: DataTableColumn<User>[] = [
    {
      id: 'id',
      label: 'ID',
      minWidth: 60,
      render: (row) => row.id,
    },
    {
      id: 'username',
      label: 'Tên đăng nhập',
      minWidth: 150,
      render: (row) => <strong>{row.username}</strong>,
    },
    {
      id: 'fullName',
      label: 'Họ tên',
      minWidth: 150,
      render: (row) => row.fullName,
    },
    {
      id: 'role',
      label: 'Quyền',
      minWidth: 120,
      render: (row) => (
        <Chip
          label={row.role === AdminRole.ADMIN ? 'Admin' : 'User'}
          size="small"
          sx={{
            bgcolor:
              row.role === AdminRole.ADMIN
                ? `${brandColors.primaryContainer}22`
                : `${brandColors.statusSuccess}22`,
            color:
              row.role === AdminRole.ADMIN
                ? brandColors.primaryContainer
                : brandColors.statusSuccess,
            fontWeight: 600,
          }}
        />
      ),
    },
    {
      id: 'createdAt',
      label: 'Ngày tạo',
      minWidth: 150,
      render: (row) => new Date(row.createdAt).toLocaleDateString('vi-VN'),
    },
    {
      id: 'actions',
      label: 'Thao tác',
      minWidth: 160,
      align: 'center',
      render: (row) => (
        <>
          <Tooltip title="Đổi mật khẩu">
            <IconButton
              size="small"
              color="warning"
              onClick={() => handleOpenPassword(row)}
            >
              <KeyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sửa">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleOpenEdit(row)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(row.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];



  return (
    <>
      <AdminTable
        title="Quản lý Tài khoản"
        description="Quản lý danh sách tài khoản quản trị hệ thống"
        columns={columns}
        rows={users}
        getRowId={(row) => row.id}
        loading={loading}
        showSearch
        searchPlaceholder="Tìm theo tên đăng nhập hoặc họ tên..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            key: 'role',
            label: 'Quyền',
            value: roleFilter,
            options: [
              { label: 'Admin', value: AdminRole.ADMIN },
              { label: 'User', value: AdminRole.USER },
            ],
          },
        ]}
        onFilterChange={(key, value) => {
          if (key === 'role') {
            setRoleFilter(value);
            load(1, { role: value });
          }
        }}
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={15}
        onPageChange={(p) => load(p)}
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            disableElevation
            sx={{
              bgcolor: brandColors.primaryContainer,
              color: brandColors.onPrimary,
              '&:hover': {
                bgcolor: brandColors.primary,
              },
            }}
          >
            Thêm tài khoản
          </Button>
        }
      />

      <UserForm
        open={formOpen}
        user={editingUser}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        loading={submitting}
      />

      <ChangePasswordForm
        open={passwordFormOpen}
        user={passwordUser}
        onClose={handleClosePasswordForm}
        onSubmit={handlePasswordSubmit}
        loading={submitting}
      />
    </>
  );
}
