'use client';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useForm, Controller } from 'react-hook-form';
import { AdminRole, CreateUserDto, UpdateUserDto, User } from '@/types';
import { useEffect, useState } from 'react';

interface UserFormProps {
  open: boolean;
  user?: User | null;
  onClose: () => void;
  onSubmit: (data: CreateUserDto | UpdateUserDto) => Promise<void>;
  loading?: boolean;
}

interface UserFormData {
  username?: string;
  password?: string;
  fullName: string;
  role: AdminRole;
}

export default function UserForm({
  open,
  user,
  onClose,
  onSubmit,
  loading = false,
}: UserFormProps) {
  const isEdit = Boolean(user);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    defaultValues: {
      username: '',
      password: '',
      fullName: '',
      role: AdminRole.USER,
    },
  });

  useEffect(() => {
    if (open) {
      if (user) {
        reset({
          fullName: user.fullName,
          role: user.role,
        });
      } else {
        reset({
          username: '',
          password: '',
          fullName: '',
          role: AdminRole.USER,
        });
      }
    }
  }, [open, user, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {isEdit ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới'}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {!isEdit && (
              <>
                <Controller
                  name="username"
                  control={control}
                  rules={{ required: 'Tên đăng nhập là bắt buộc' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Tên đăng nhập *"
                      fullWidth
                      error={!!errors.username}
                      helperText={errors.username?.message as string}
                    />
                  )}
                />
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: 'Mật khẩu là bắt buộc',
                    minLength: {
                      value: 6,
                      message: 'Mật khẩu phải có ít nhất 6 ký tự',
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Mật khẩu *"
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      error={!!errors.password}
                      helperText={errors.password?.message as string}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                tabIndex={-1}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  )}
                />
              </>
            )}

            <Controller
              name="fullName"
              control={control}
              rules={{ required: 'Họ tên là bắt buộc' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Họ tên *"
                  fullWidth
                  error={!!errors.fullName}
                  helperText={errors.fullName?.message as string}
                />
              )}
            />

            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id="role-label">Quyền *</InputLabel>
                  <Select {...field} labelId="role-label" label="Quyền *">
                    <MenuItem value={AdminRole.USER}>User</MenuItem>
                    <MenuItem value={AdminRole.ADMIN}>Admin</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading} color="inherit">
            Hủy
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu lại'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
