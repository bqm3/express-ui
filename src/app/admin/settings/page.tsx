'use client';

import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
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
import TelegramIcon from '@mui/icons-material/Telegram';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
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

  // Telegram fields & state
  const [telegramBotToken, setTelegramBotToken] = useState(
    '8982469312:AAGxmU48_ou-Ws6fav0O6G6t2gD_Fr0nglI',
  );
  const [telegramChatId, setTelegramChatId] = useState('');
  const [telegramEnabled, setTelegramEnabled] = useState(true);
  const [testingTelegram, setTestingTelegram] = useState(false);
  const [fetchingUpdates, setFetchingUpdates] = useState(false);
  const [detectedChats, setDetectedChats] = useState<
    { id: number | string; name: string; type: string }[]
  >([]);

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

      setTelegramBotToken(
        map.telegram_bot_token ??
          '8982469312:AAGxmU48_ou-Ws6fav0O6G6t2gD_Fr0nglI',
      );
      setTelegramChatId(map.telegram_chat_id ?? '');
      setTelegramEnabled(map.telegram_notification_enabled !== 'false');

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
        telegram_bot_token: telegramBotToken.trim(),
        telegram_chat_id: telegramChatId.trim(),
        telegram_notification_enabled: telegramEnabled ? 'true' : 'false',
      });
      snackbar.success('Đã lưu cấu hình hệ thống & thông báo Telegram!');
    } catch (err) {
      snackbar.error(
        err instanceof Error ? err.message : 'Lưu cấu hình thất bại',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleTestTelegram = async () => {
    if (!telegramChatId.trim()) {
      snackbar.error('Vui lòng nhập Telegram Chat ID trước khi kiểm tra');
      return;
    }
    setTestingTelegram(true);
    try {
      await settingsApi.sendTestTelegram({
        botToken: telegramBotToken.trim() || undefined,
        chatId: telegramChatId.trim(),
      });
      snackbar.success('Đã gửi tin nhắn thử nghiệm thành công! Vui lòng kiểm tra Telegram.');
    } catch (err) {
      snackbar.error(
        err instanceof Error ? err.message : 'Gửi tin nhắn Telegram thử nghiệm thất bại',
      );
    } finally {
      setTestingTelegram(false);
    }
  };

  const handleFetchUpdates = async () => {
    setFetchingUpdates(true);
    try {
      const updates = await settingsApi.getTelegramUpdates(
        telegramBotToken.trim() || undefined,
      );

      if (!Array.isArray(updates) || !updates.length) {
        snackbar.info(
          'Chưa có tin nhắn mới gửi tới Bot. Vui lòng mở Telegram, tìm bot và nhấn /start hoặc gửi 1 tin nhắn, sau đó bấm lại nút này.',
        );
        return;
      }

      const foundMap = new Map<number | string, { id: number | string; name: string; type: string }>();
      for (const item of updates) {
        const chat = item.message?.chat || item.my_chat_member?.chat;
        if (chat && chat.id) {
          const name = chat.title || [chat.first_name, chat.last_name].filter(Boolean).join(' ') || chat.username || `Chat #${chat.id}`;
          foundMap.set(chat.id, {
            id: chat.id,
            name: `${name} (${chat.type})`,
            type: chat.type,
          });
        }
      }

      const list = Array.from(foundMap.values());
      setDetectedChats(list);

      if (list.length === 1 && !telegramChatId.trim()) {
        setTelegramChatId(String(list[0].id));
        snackbar.success(`Đã tự động điền Chat ID: ${list[0].id} (${list[0].name})`);
      } else if (list.length > 0) {
        snackbar.success(`Tìm thấy ${list.length} cuộc hội thoại từ Telegram!`);
      } else {
        snackbar.info('Không tìm thấy cuộc hội thoại nào.');
      }
    } catch (err) {
      snackbar.error(
        err instanceof Error ? err.message : 'Không thể lấy dữ liệu từ Telegram',
      );
    } finally {
      setFetchingUpdates(false);
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
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
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

        {/* Telegram Notification Settings */}
        <Grid size={{ xs: 12 }}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 0,
              border: `1px solid ${brandColors.primaryContainer}`,
              boxShadow: '0 4px 18px rgba(27, 41, 116, 0.06)',
            }}
          >
            <CardHeader
              avatar={<TelegramIcon sx={{ color: '#229ED9', fontSize: 32 }} />}
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.navy }}>
                    Cấu hình Thông báo Telegram
                  </Typography>
                  <Chip
                    size="small"
                    label={telegramEnabled ? 'Đang hoạt động' : 'Tạm tắt'}
                    color={telegramEnabled ? 'success' : 'default'}
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              }
              subheader="Tự động bắn thông báo tức thời về Telegram mỗi khi có khách gửi yêu cầu tại trang Liên hệ"
            />
            <Divider />
            <CardContent>
              <Stack spacing={2.5}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={telegramEnabled}
                      onChange={(e) => setTelegramEnabled(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography sx={{ fontWeight: 600 }}>
                      Bật gửi thông báo về Telegram khi có khách gửi liên hệ mới
                    </Typography>
                  }
                />

                <TextField
                  label="Telegram Bot API Token"
                  fullWidth
                  value={telegramBotToken}
                  onChange={(e) => setTelegramBotToken(e.target.value)}
                  placeholder="8982469312:AAGxmU48_ou-Ws6fav0O6G6t2gD_Fr0nglI"
                  helperText="Token của Telegram Bot quản trị (mặc định: 8982469312:AAGxmU48_ou-Ws6fav0O6G6t2gD_Fr0nglI)"
                />

                <Grid container spacing={2} sx={{ alignItems: 'flex-start' }}>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <TextField
                      label="Telegram Chat ID (Người nhận hoặc Nhóm)"
                      fullWidth
                      value={telegramChatId}
                      onChange={(e) => setTelegramChatId(e.target.value)}
                      placeholder="VD: 123456789 hoặc -1001234567890 (có thể nhập nhiều ID cách nhau bằng dấu phẩy)"
                      helperText="Nhập Chat ID của bạn hoặc nhóm. Có thể dùng nút 'Lấy Chat ID từ Bot' bên cạnh để tự động nhận diện."
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Stack direction="row" spacing={1} sx={{ pt: { xs: 0, md: 0.5 } }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={
                          fetchingUpdates ? (
                            <CircularProgress size={16} />
                          ) : (
                            <SearchIcon />
                          )
                        }
                        onClick={handleFetchUpdates}
                        disabled={fetchingUpdates}
                        sx={{ py: 1.25 }}
                      >
                        {fetchingUpdates ? 'Đang tìm...' : 'Lấy Chat ID từ Bot'}
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        startIcon={
                          testingTelegram ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : (
                            <SendIcon />
                          )
                        }
                        onClick={handleTestTelegram}
                        disabled={testingTelegram || !telegramChatId.trim()}
                        sx={{ py: 1.25 }}
                      >
                        {testingTelegram ? 'Đang gửi...' : 'Test gửi'}
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>

                {detectedChats.length > 0 && (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      bgcolor: '#F0F7FF',
                      borderColor: '#B9D5FF',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#0052CC' }}>
                      Các cuộc hội thoại gần đây gửi tới Bot:
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
                      {detectedChats.map((c) => (
                        <Chip
                          key={c.id}
                          label={`${c.name} (ID: ${c.id})`}
                          clickable
                          color={telegramChatId === String(c.id) ? 'primary' : 'default'}
                          onClick={() => {
                            setTelegramChatId(String(c.id));
                            snackbar.info(`Đã chọn Chat ID: ${c.id}`);
                          }}
                          sx={{ my: 0.5 }}
                        />
                      ))}
                    </Stack>
                  </Paper>
                )}

                <Alert severity="info" sx={{ borderRadius: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    📌 Hướng dẫn cài đặt nhận thông báo Telegram:
                  </Typography>
                  <Typography variant="body2" component="div">
                    1. Mở ứng dụng Telegram, tìm kiếm bot <b>@express_buupham24h_bot</b>.<br />
                    2. Nhấn <b>/start</b> hoặc gửi bất kỳ tin nhắn nào cho bot (hoặc thêm bot vào nhóm chat của bạn).<br />
                    3. Bấm nút <b>"Lấy Chat ID từ Bot"</b> ở trên để hệ thống tự nhận diện Chat ID, hoặc điền trực tiếp Chat ID.<br />
                    4. Bấm <b>"Test gửi"</b> để kiểm tra nhận tin nhắn, sau đó bấm <b>"Lưu thay đổi"</b> ở góc trên.
                  </Typography>
                </Alert>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
