'use client';

import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { brandColors } from '@/lib/theme';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        gap: 2,
      }}
    >
      <BlockOutlinedIcon sx={{ fontSize: 80, color: brandColors.error }} />
      <Typography variant="h4" sx={{ color: brandColors.error, fontWeight: 700 }}>
        403 - Không có quyền truy cập
      </Typography>
      <Typography color="text.secondary">
        Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên (Admin) nếu bạn cần hỗ trợ.
      </Typography>
      <Button
        variant="contained"
        onClick={() => router.push('/admin')}
        sx={{ mt: 2 }}
      >
        Quay lại trang chủ
      </Button>
    </Box>
  );
}
