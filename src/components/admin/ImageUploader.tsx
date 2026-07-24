'use client';

import { useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { uploadApi } from '@/lib/api/uploadApi';
import { brandColors } from '@/lib/theme';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploader({
  value,
  onChange,
  label = 'Ảnh đại diện',
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const result = await uploadApi.uploadImage(file);
      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle2">{label}</Typography>
      {value && (
        <Box
          component="img"
          src={value}
          alt="Preview"
          sx={{
            width: '100%',
            maxWidth: 360,
            maxHeight: 200,
            objectFit: 'cover',
            borderRadius: 1.5,
            border: `1px solid ${brandColors.border}`,
          }}
        />
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <Button
        variant="outlined"
        startIcon={
          loading ? (
            <CircularProgress size={16} />
          ) : (
            <CloudUploadOutlinedIcon />
          )
        }
        disabled={loading}
        onClick={() => inputRef.current?.click()}
        sx={{ alignSelf: 'flex-start' }}
      >
        {loading ? 'Đang tải lên...' : 'Chọn ảnh'}
      </Button>
      {error && <Alert severity="error">{error}</Alert>}
    </Stack>
  );
}
