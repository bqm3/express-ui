'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { settingsApi } from '@/lib/api/settingsApi';
import { useSnackbar } from '@/hooks/useSnackbar';
import { brandColors } from '@/lib/theme';
import type { FooterBranch } from '@/types';

export default function AdminSettingsPage() {
  const snackbar = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [headerTitle, setHeaderTitle] = useState('');
  const [headerHotline, setHeaderHotline] = useState('');
  const [headerHotlineLink, setHeaderHotlineLink] = useState('');
  const [footerHotline, setFooterHotline] = useState('');
  const [footerHotlineLink, setFooterHotlineLink] = useState('');
  const [showGoogleMap, setShowGoogleMap] = useState(false);
  const [googleMapEmbedUrl, setGoogleMapEmbedUrl] = useState('');
  const [branches, setBranches] = useState<FooterBranch[]>([]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const items = await settingsApi.getAdminSettings();
      const map: Record<string, string> = {};
      for (const item of items) {
        map[item.key] = item.value;
      }

      setHeaderTitle(
        map.header_title ??
          'Dịch vụ gửi hàng đi nước ngoài uy tín — giá rẻ TP.HCM | 15 năm kinh nghiệm',
      );
      setHeaderHotline(map.header_hotline ?? 'Hotline 0907.277.502');
      setHeaderHotlineLink(map.header_hotline_link ?? 'tel:0907277502');
      setFooterHotline(map.footer_hotline ?? 'Hotline 0907.277.502');
      setFooterHotlineLink(map.footer_hotline_link ?? 'tel:0907277502');
      setShowGoogleMap(map.show_google_map === 'true');
      setGoogleMapEmbedUrl(map.google_map_embed_url ?? '');

      let parsedBranches: FooterBranch[] = [];
      try {
        if (map.footer_branches) {
          const arr = JSON.parse(map.footer_branches);
          if (Array.isArray(arr)) parsedBranches = arr;
        }
      } catch {
        parsedBranches = [];
      }

      if (!parsedBranches.length) {
        parsedBranches = [
          {
            title: '',
            address: 'Số 5 Nguyễn Văn Vĩnh, P.4, Q. Tân Bình, TP.HCM',
            phone: 'ĐT: (028) 6678 1779',
          },
          {
            title: 'GLLogistics Quy Nhơn — Bình Định',
            address: '',
            phone: 'ĐT: (056) 353 1419 — 091 442 7842',
          },
        ];
      }
      setBranches(parsedBranches);
    } catch (err) {
      snackbar.error(
        err instanceof Error ? err.message : 'Không tải được cài đặt',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddBranch = () => {
    setBranches((list) => [
      ...list,
      {
        title: '',
        address: '',
        phone: '',
      },
    ]);
  };

  const handleUpdateBranch = (
    index: number,
    field: keyof FooterBranch,
    val: string,
  ) => {
    setBranches((list) =>
      list.map((item, idx) =>
        idx === index ? { ...item, [field]: val } : item,
      ),
    );
  };

  const handleRemoveBranch = (index: number) => {
    setBranches((list) => list.filter((_, idx) => idx !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const validBranches = branches.filter(
        (b) => (b.title || '').trim() || (b.address || '').trim() || (b.phone || '').trim(),
      );

      await settingsApi.updateSettings({
        header_title: headerTitle.trim(),
        header_hotline: headerHotline.trim(),
        header_hotline_link: headerHotlineLink.trim(),
        footer_hotline: footerHotline.trim(),
        footer_hotline_link: footerHotlineLink.trim(),
        footer_branches: JSON.stringify(validBranches),
        show_google_map: showGoogleMap ? 'true' : 'false',
        google_map_embed_url: googleMapEmbedUrl.trim(),
      });
      snackbar.success('Đã lưu cấu hình hệ thống!');
    } catch (err) {
      snackbar.error(
        err instanceof Error ? err.message : 'Lưu cấu hình thất bại',
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress size={36} />
        <Typography sx={{ mt: 1.5, color: 'text.secondary' }}>
          Đang tải cấu hình hệ thống...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, color: brandColors.navy }}>
          Cấu hình Hệ thống Website
        </Typography>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadSettings}
            disabled={saving}
          >
            Tải lại
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Header Settings */}
        <Grid size={{ xs: 12 }}>
          <Card variant="outlined" sx={{ borderRadius: 0 }}>
            <CardHeader
              title="Cấu hình Header Bar"
              subheader="Dòng tiêu đề phụ và Hotline trên cùng góc phải website"
            />
            <Divider />
            <CardContent>
              <Stack spacing={2.5}>
                <TextField
                  label="Dòng chữ tiêu đề Header (Subtitle)"
                  fullWidth
                  value={headerTitle}
                  onChange={(e) => setHeaderTitle(e.target.value)}
                  placeholder="Dịch vụ gửi hàng đi nước ngoài uy tín — giá rẻ TP.HCM | 15 năm kinh nghiệm"
                  helperText="Hiển thị ở góc trái thanh header navy trên desktop"
                />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Text Hotline Header"
                      fullWidth
                      value={headerHotline}
                      onChange={(e) => setHeaderHotline(e.target.value)}
                      placeholder="Hotline 0907.277.502"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Đường dẫn liên hệ Header (href)"
                      fullWidth
                      value={headerHotlineLink}
                      onChange={(e) => setHeaderHotlineLink(e.target.value)}
                      placeholder="tel:0907277502"
                      helperText="Ví dụ: tel:0907277502 hoặc link Zalo/URL"
                    />
                  </Grid>
                </Grid>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Footer Branches & Addresses Settings */}
        <Grid size={{ xs: 12 }}>
          <Card variant="outlined" sx={{ borderRadius: 0 }}>
            <CardHeader
              title="Cấu hình Địa chỉ & Chi nhánh (Footer)"
              subheader="Quản lý danh sách văn phòng, chi nhánh hiển thị ở chân trang. Bạn có thể thêm không giới hạn địa chỉ."
              action={
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleAddBranch}
                >
                  Thêm chi nhánh / Địa chỉ
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <Stack spacing={2}>
                {branches.map((branch, idx) => (
                  <Paper
                    key={idx}
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 0,
                      bgcolor: brandColors.offWhite,
                      borderColor: brandColors.border,
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1.5,
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PlaceOutlinedIcon sx={{ color: brandColors.navy, fontSize: 20 }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          Địa chỉ / Chi nhánh #{idx + 1}
                        </Typography>
                      </Stack>
                      {branches.length > 1 && (
                        <Tooltip title="Xóa chi nhánh này">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveBranch(idx)}
                          >
                            <DeleteOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          label="Tên chi nhánh (tùy chọn)"
                          fullWidth
                          size="small"
                          value={branch.title || ''}
                          onChange={(e) =>
                            handleUpdateBranch(idx, 'title', e.target.value)
                          }
                          placeholder="VD: GLLogistics Quy Nhơn — Bình Định"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          label="Địa chỉ"
                          fullWidth
                          size="small"
                          value={branch.address || ''}
                          onChange={(e) =>
                            handleUpdateBranch(idx, 'address', e.target.value)
                          }
                          placeholder="VD: Số 5 Nguyễn Văn Vĩnh, P.4, Q. Tân Bình, TP.HCM"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          label="Số điện thoại / Liên hệ chi nhánh"
                          fullWidth
                          size="small"
                          value={branch.phone || ''}
                          onChange={(e) =>
                            handleUpdateBranch(idx, 'phone', e.target.value)
                          }
                          placeholder="VD: ĐT: (028) 6678 1779"
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Footer Hotline Settings */}
        <Grid size={{ xs: 12 }}>
          <Card variant="outlined" sx={{ borderRadius: 0 }}>
            <CardHeader
              title="Cấu hình Footer Hotline"
              subheader="Thông tin Hotline hiển thị ở khối chân trang (Footer)"
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Text Hotline Footer"
                    fullWidth
                    value={footerHotline}
                    onChange={(e) => setFooterHotline(e.target.value)}
                    placeholder="Hotline 0907.277.502"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Đường dẫn liên hệ Footer (href)"
                    fullWidth
                    value={footerHotlineLink}
                    onChange={(e) => setFooterHotlineLink(e.target.value)}
                    placeholder="tel:0907277502"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Google Map Settings */}
        <Grid size={{ xs: 12 }}>
          <Card variant="outlined" sx={{ borderRadius: 0 }}>
            <CardHeader
              title="Cấu hình Google Maps (Trang Liên Hệ)"
              subheader="Quản lý hiển thị bản đồ Google Maps trên trang Liên hệ"
            />
            <Divider />
            <CardContent>
              <Stack spacing={2.5}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showGoogleMap}
                      onChange={(e) => setShowGoogleMap(e.target.checked)}
                    />
                  }
                  label={
                    <Typography sx={{ fontWeight: 600 }}>
                      Hiển thị Google Maps ở trang Liên hệ ({showGoogleMap ? 'Đang bật' : 'Tạm đóng'})
                    </Typography>
                  }
                />
                <Typography variant="body2" color="text.secondary">
                  Khi tắt công tắc này, bản đồ Google Map trên trang /lien-he sẽ tạm thời được ẩn đi.
                </Typography>

                <TextField
                  label="URL Embed Google Maps"
                  fullWidth
                  multiline
                  rows={2}
                  value={googleMapEmbedUrl}
                  onChange={(e) => setGoogleMapEmbedUrl(e.target.value)}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  helperText="Link iframe từ Google Maps Embed"
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
