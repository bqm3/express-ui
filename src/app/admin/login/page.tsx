'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { authApi } from '@/lib/api/authApi';
import { brandColors } from '@/lib/theme';
import GLLogo from '@/components/common/GLLogo';

const schema = z.object({
  username: z.string().min(1, 'Nhập tên đăng nhập'),
  password: z.string().min(1, 'Nhập mật khẩu'),
});

type FormValues = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authApi.getToken()) {
      router.replace('/admin/posts');
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      const result = await authApi.login(values);
      authApi.setSession(result);
      router.replace('/admin/posts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: 2,
        background: `
          radial-gradient(ellipse at 20% 0%, rgba(11,110,79,0.15), transparent 50%),
          radial-gradient(ellipse at 100% 100%, rgba(232,168,56,0.12), transparent 45%),
          ${brandColors.offWhite}
        `,
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={0} sx={{ p: 4, border: `1px solid ${brandColors.border}` }}>
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              mb: 3
            }}>
            <GLLogo size={56} showSubtitle={false} />
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="caption"
                sx={{
                  color: brandColors.onSurfaceVariant,
                  display: 'block',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Hệ Thống Quản Trị
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                textAlign: 'center',
                fontSize: '0.85rem',
              }}
            >
              Đăng nhập để quản lý bài viết, danh mục và yêu cầu liên hệ
            </Typography>
          </Stack>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField
                label="Tên đăng nhập"
                fullWidth
                autoComplete="username"
                {...register('username')}
                error={!!errors.username}
                helperText={errors.username?.message}
              />
              <TextField
                label="Mật khẩu"
                type="password"
                fullWidth
                autoComplete="current-password"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting}
                fullWidth
              >
                {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
