'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { User, UpdateUserDto, ChangePasswordDto } from '@/types/user';
import { usersApi } from '@/lib/api/usersApi';
import { authApi } from '@/lib/api/authApi';
import { useSnackbar } from '@/hooks/useSnackbar';

export default function ProfilePage() {
  const snackbar = useSnackbar();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    control: profileControl,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm<UpdateUserDto>({
    defaultValues: {
      fullName: '',
    },
  });

  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<ChangePasswordDto>({
    defaultValues: {
      newPassword: '',
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = authApi.getUser();
        if (currentUser) {
          const data = await usersApi.getById(currentUser.id);
          setUser(data);
          resetProfile({ fullName: data.fullName });
        }
      } catch (err: any) {
        snackbar.error(err.message || 'Lỗi tải thông tin');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [resetProfile]);

  const onUpdateProfile = async (data: UpdateUserDto) => {
    if (!user) return;
    try {
      setSubmitting(true);
      await usersApi.update(user.id, data);
      snackbar.success('Cập nhật thông tin thành công');
      // Update local storage
      const session = authApi.getUser();
      if (session) {
        authApi.setSession({
          accessToken: authApi.getToken() || '',
          user: { ...session, fullName: data.fullName },
        });
      }
    } catch (err: any) {
      snackbar.error(err.message || 'Lỗi cập nhật');
    } finally {
      setSubmitting(false);
    }
  };

  const onChangePassword = async (data: ChangePasswordDto) => {
    if (!user) return;
    try {
      setSubmitting(true);
      await usersApi.changePassword(user.id, data);
      snackbar.success('Đổi mật khẩu thành công');
      resetPassword({ newPassword: '' });
    } catch (err: any) {
      snackbar.error(err.message || 'Lỗi đổi mật khẩu');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Typography>Đang tải...</Typography>;
  }

  if (!user) {
    return <Typography color="error">Không tìm thấy thông tin</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
        Hồ sơ cá nhân
      </Typography>
      <Card sx={{ mb: 4 }}>
        <CardHeader title="Thông tin cá nhân" />
        <Divider />
        <CardContent>
          <form onSubmit={handleProfileSubmit(onUpdateProfile)}>
            <Stack spacing={3}>
              <TextField
                label="Tên đăng nhập"
                value={user.username}
                disabled
                fullWidth
              />
              <Controller
                name="fullName"
                control={profileControl}
                rules={{ required: 'Họ tên là bắt buộc' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Họ tên *"
                    fullWidth
                    error={!!profileErrors.fullName}
                    helperText={profileErrors.fullName?.message as string}
                  />
                )}
              />
              <Box>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                >
                  {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Đổi mật khẩu" />
        <Divider />
        <CardContent>
          <form onSubmit={handlePasswordSubmit(onChangePassword)}>
            <Stack spacing={3}>
              <Controller
                name="newPassword"
                control={passwordControl}
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
                    type="password"
                    fullWidth
                    error={!!passwordErrors.newPassword}
                    helperText={passwordErrors.newPassword?.message as string}
                  />
                )}
              />
              <Box>
                <Button
                  type="submit"
                  variant="contained"
                  color="warning"
                  disabled={submitting}
                >
                  {submitting ? 'Đang lưu...' : 'Đổi mật khẩu'}
                </Button>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
