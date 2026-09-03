import type { Metadata } from 'next';
import { Box, Container, Typography } from '@mui/material';
import TrackingSearchBox from '@/components/tracking/TrackingSearchBox';
import { brandColors } from '@/lib/theme';

export const metadata: Metadata = {
  title: 'Tra cứu vận đơn',
  description:
    'Tra cứu vận đơn DHL, FedEx, UPS tức thì với Gia Long Logistics.',
};

export default function TraCuuPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="overline"
          sx={{
            color: "secondary.dark",
            fontWeight: 700
          }}>
          Tracking
        </Typography>
        <Typography variant="h3" component="h1" gutterBottom>
          Tra cứu vận đơn
        </Typography>
        <Typography
          sx={{
            color: "text.secondary",
            maxWidth: 480,
            mx: 'auto'
          }}>
          Nhập mã tracking để xem lịch trình real-time từ DHL, FedEx hoặc UPS.
        </Typography>
      </Box>
      <Box
        sx={{
          p: { xs: 2.5, md: 3.5 },
          borderRadius: 2,
          bgcolor: 'background.paper',
          border: `1px solid ${brandColors.border}`,
        }}
      >
        <TrackingSearchBox />
      </Box>
    </Container>
  );
}
