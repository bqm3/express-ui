'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { contactApi } from '@/lib/api/contactApi';
import { brandColors } from '@/lib/theme';

const schema = z
  .object({
    fullName: z
      .string()
      .trim()
      .max(150, 'Họ tên tối đa 150 ký tự')
      .optional()
      .or(z.literal('')),
    phone: z
      .string()
      .trim()
      .max(30, 'Số điện thoại tối đa 30 ký tự')
      .optional()
      .or(z.literal('')),
    email: z
      .string()
      .trim()
      .max(150, 'Email tối đa 150 ký tự')
      .optional()
      .or(z.literal('')),
    subject: z
      .string()
      .trim()
      .max(255, 'Tiêu đề tối đa 255 ký tự')
      .optional()
      .or(z.literal('')),
    message: z
      .string()
      .trim()
      .optional()
      .or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    const hasPhone = !!data.phone && data.phone.trim().length > 0;
    const hasEmail = !!data.email && data.email.trim().length > 0;

    if (!hasPhone && !hasEmail) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Vui lòng nhập Số điện thoại hoặc Email',
        path: ['phone'],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Vui lòng nhập Số điện thoại hoặc Email',
        path: ['email'],
      });
      return;
    }

    if (hasPhone) {
      const clean = data.phone!.replace(/[\s.-]/g, '');
      if (clean.length < 8 || !/^[+]?[0-9]{8,20}$/.test(clean)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Số điện thoại không hợp lệ (tối thiểu 8 chữ số)',
          path: ['phone'],
        });
      }
    }

    if (data.email && data.email.trim().length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email.trim())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Email không đúng định dạng',
          path: ['email'],
        });
      }
    }
  });

type FormValues = z.infer<typeof schema>;

interface ContactFormProps {
  sourcePage?: string;
}

export default function ContactForm({ sourcePage }: ContactFormProps) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    setSuccess(false);
    try {
      const payload: Record<string, string> = {};
      if (values.fullName?.trim()) payload.fullName = values.fullName.trim();
      if (values.phone?.trim()) payload.phone = values.phone.trim();
      if (values.email?.trim()) payload.email = values.email.trim();
      if (values.subject?.trim()) payload.subject = values.subject.trim();
      if (values.message?.trim()) payload.message = values.message.trim();
      if (sourcePage) {
        payload.sourcePage = sourcePage;
      } else if (typeof window !== 'undefined' && window.location.pathname) {
        payload.sourcePage = window.location.pathname;
      }

      await contactApi.create(payload as any);
      setSuccess(true);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gửi yêu cầu thất bại');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2.5}>
        {success && (
          <Alert severity="success" sx={{ borderRadius: 0 }}>
            Cảm ơn bạn! Chúng tôi đã nhận được thông tin và sẽ liên hệ hỗ trợ sớm nhất.
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ borderRadius: 0 }}>
            {error}
          </Alert>
        )}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Họ và tên"
            fullWidth
            placeholder="VD: Nguyễn Văn A"
            {...register('fullName')}
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
          />
          <TextField
            label="Số điện thoại"
            fullWidth
            placeholder="VD: 0901234567"
            {...register('phone')}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />
        </Stack>

        <TextField
          label="Email"
          type="email"
          fullWidth
          placeholder="VD: email@example.com"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          label="Tiêu đề"
          fullWidth
          placeholder="VD: Tư vấn gửi hàng đi Mỹ / Báo giá chuyển phát nhanh"
          {...register('subject')}
          error={!!errors.subject}
          helperText={errors.subject?.message}
        />

        <TextField
          label="Nội dung"
          fullWidth
          multiline
          minRows={3}
          placeholder="Mô tả nhu cầu gửi hàng của bạn (loại hàng hóa, cân nặng ước tính, địa chỉ nhận...)"
          {...register('message')}
          error={!!errors.message}
          helperText={errors.message?.message}
        />

        <Box>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            endIcon={<SendOutlinedIcon />}
            sx={{
              borderRadius: 0,
              px: 4,
              py: 1.25,
              fontWeight: 700,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(27, 41, 116, 0.25)',
              },
            }}
          >
            {isSubmitting ? 'Đang gửi thông tin...' : 'Gửi yêu cầu liên hệ'}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
