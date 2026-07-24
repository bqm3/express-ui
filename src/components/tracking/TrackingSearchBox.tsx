'use client';

import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { trackingApi } from '@/lib/api/trackingApi';
import type { Carrier, TrackingResult } from '@/types';
import TrackingTimeline from './TrackingTimeline';

const carriers: Array<{ value: '' | Carrier; label: string }> = [
  { value: '', label: 'Tự động nhận diện' },
  { value: 'DHL', label: 'DHL' },
  { value: 'FEDEX', label: 'FedEx' },
  { value: 'UPS', label: 'UPS' },
];

export default function TrackingSearchBox() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState<'' | Carrier>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrackingResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = trackingNumber.trim();
    if (!trimmed) {
      setError('Vui lòng nhập mã vận đơn');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await trackingApi.track({
        trackingNumber: trimmed,
        ...(carrier ? { carrier } : {}),
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tìm thấy vận đơn');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Box component="form" onSubmit={handleSearch}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1.5}
          sx={{
            alignItems: { md: 'flex-start' }
          }}
        >
          <TextField
            label="Mã vận đơn"
            placeholder="Nhập mã tracking DHL / FedEx / UPS"
            fullWidth
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
          <FormControl sx={{ minWidth: { md: 200 }, width: { xs: '100%', md: 'auto' } }}>
            <InputLabel id="carrier-label">Hãng vận chuyển</InputLabel>
            <Select
              labelId="carrier-label"
              label="Hãng vận chuyển"
              value={carrier}
              onChange={(e) => setCarrier(e.target.value as '' | Carrier)}
            >
              {carriers.map((c) => (
                <MenuItem key={c.label} value={c.value}>
                  {c.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <SearchOutlinedIcon />
              )
            }
            sx={{ minWidth: 140, height: 56 }}
          >
            Tra cứu
          </Button>
        </Stack>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
      {result && (
        <Box
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{
              justifyContent: "space-between",
              mb: 2
            }}>
            <Box>
              <Typography
                variant="overline"
                sx={{
                  color: "secondary.main",
                  fontWeight: 700
                }}>
                {result.carrier}
              </Typography>
              <Typography variant="h5">{result.trackingNumber}</Typography>
              <Typography sx={{
                color: "text.secondary"
              }}>{result.statusDescription}</Typography>
            </Box>
            <Box sx={{ textAlign: { sm: 'right' } }}>
              <Typography variant="body2" sx={{
                color: "text.secondary"
              }}>
                Trạng thái
              </Typography>
              <Typography variant="h6" sx={{
                color: "primary.main"
              }}>
                {result.status}
              </Typography>
              {result.estimatedDelivery && (
                <Typography variant="body2" sx={{
                  color: "text.secondary"
                }}>
                  Dự kiến giao: {result.estimatedDelivery}
                </Typography>
              )}
            </Box>
          </Stack>

          {(result.origin || result.destination) && (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                mb: 2
              }}>
              {result.origin && <>Điểm gửi: {result.origin}</>}
              {result.origin && result.destination && ' → '}
              {result.destination && <>Điểm đến: {result.destination}</>}
            </Typography>
          )}

          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              mb: 1
            }}>
            Lịch trình vận chuyển
          </Typography>
          <TrackingTimeline events={result.events || []} />
        </Box>
      )}
    </Stack>
  );
}
