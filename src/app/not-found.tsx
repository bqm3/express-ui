import Link from 'next/link';
import { Box, Button, Container, Typography } from '@mui/material';

export default function NotFound() {
  return (
    <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>
        404
      </Typography>
      <Typography
        sx={{
          color: "text.secondary",
          mb: 3
        }}>
        Không tìm thấy trang bạn yêu cầu.
      </Typography>
      <Box>
        <Button component={Link} href="/" variant="contained">
          Về trang chủ
        </Button>
      </Box>
    </Container>
  );
}
