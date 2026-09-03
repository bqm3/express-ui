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
} from '@mui/material';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { contactApi } from '@/lib/api/contactApi';

const schema = z.object({
  fullName: z.string().min(2, 'Vui lòng nhập họ tên').max(150),
  phone: z.string().min(8, 'Số điện thoại không hợp lệ').max(30),
  email: z.string().email('Email không hợp lệ'),
  subject: z.string().min(3, 'Vui lòng nhập tiêu đề').max(255),
  message: z.string().min(10, 'Nội dung tối thiểu 10 ký tự'),
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
      await contactApi.create({
        ...values,
        sourcePage: sourcePage || (typeof window !== 'undefined' ? window.location.pathname : undefined),
      });
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
          <Alert severity="success">
            Cảm ơn bạn! Chúng tôi đã nhận được yêu cầu và sẽ phản hồi sớm.
          </Alert>
        )}
        {error && <Alert severity="error">{error}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Họ và tên"
            fullWidth
            {...register('fullName')}
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
          />
          <TextField
            label="Số điện thoại"
            fullWidth
            {...register('phone')}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />
        </Stack>

        <TextField
          label="Email"
          type="email"
          fullWidth
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          label="Tiêu đề"
          fullWidth
          {...register('subject')}
          error={!!errors.subject}
          helperText={errors.subject?.message}
        />

        <TextField
          label="Nội dung"
          fullWidth
          multiline
          minRows={5}
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
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
          </Button>
          {/* <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              display: "block",
              mt: 1
            }}>
            Thông tin của bạn được bảo mật theo chính sách Gia Long Logistics.
          </Typography> */}
        </Box>
      </Stack>
    </Box>
  );
}
