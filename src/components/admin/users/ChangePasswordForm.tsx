'use client';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useForm, Controller } from 'react-hook-form';
import { ChangePasswordDto, User } from '@/types';
import { useEffect, useState } from 'react';

interface ChangePasswordFormProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSubmit: (data: ChangePasswordDto) => Promise<void>;
  loading?: boolean;
}

export default function ChangePasswordForm({
  open,
  user,
  onClose,
  onSubmit,
  loading = false,
}: ChangePasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordDto>({
    defaultValues: {
      newPassword: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({ newPassword: '' });
    }
  }, [open, reset]);

  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Đổi mật khẩu</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Đổi mật khẩu cho tài khoản <strong>{user.username}</strong>
          </Typography>
          <Stack spacing={3}>
            <Controller
              name="newPassword"
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
                  label="Mật khẩu mới *"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  error={!!errors.newPassword}
                  helperText={errors.newPassword?.message as string}
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
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading} color="inherit">
            Hủy
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu mật khẩu'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
