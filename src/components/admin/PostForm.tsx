'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RichTextEditor from '@/components/admin/RichTextEditor';
import ImageUploader from '@/components/admin/ImageUploader';
import { categoriesApi } from '@/lib/api/categoriesApi';
import { postsApi } from '@/lib/api/postsApi';
import type { Category, Post, PostStatus } from '@/types';

const schema = z.object({
  title: z.string().min(1, 'Nhập tiêu đề').max(500),
  slug: z
    .string()
    .min(1, 'Nhập slug')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug chỉ gồm a-z, 0-9 và dấu -'),
  categoryId: z.number().int().positive('Chọn danh mục'),
  shortDescription: z.string().optional(),
  content: z.string().min(1, 'Nhập nội dung'),
  thumbnail: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  twitterTitle: z.string().optional(),
  twitterDescription: z.string().optional(),
  twitterImage: z.string().optional(),
  canonicalUrl: z.string().optional(),
  robotsMeta: z.string().optional(),
  focusKeyword: z.string().optional(),
  schemaType: z.string().optional(),
  adsHeadline: z.string().optional(),
  adsDescription: z.string().optional(),
  adsImage: z.string().optional(),
  utmCampaign: z.string().optional(),
  conversionLabel: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
});

type FormValues = z.infer<typeof schema>;

const statusOptions: { value: PostStatus; label: string }[] = [
  { value: 'draft', label: 'Nháp' },
  { value: 'published', label: 'Xuất bản' },
  { value: 'archived', label: 'Lưu trữ' },
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface PostFormProps {
  post?: Post;
}

export default function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isEdit = Boolean(post);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      categoryId: post?.categoryId ?? 0,
      shortDescription: post?.shortDescription || '',
      content: post?.content || '',
      thumbnail: post?.thumbnail || '',
      metaTitle: post?.metaTitle || '',
      metaDescription: post?.metaDescription || '',
      metaKeywords: post?.metaKeywords || '',
      ogTitle: post?.ogTitle || '',
      ogDescription: post?.ogDescription || '',
      ogImage: post?.ogImage || '',
      twitterTitle: post?.twitterTitle || '',
      twitterDescription: post?.twitterDescription || '',
      twitterImage: post?.twitterImage || '',
      canonicalUrl: post?.canonicalUrl || '',
      robotsMeta: post?.robotsMeta || 'index,follow',
      focusKeyword: post?.focusKeyword || '',
      schemaType: post?.schemaType || 'Article',
      adsHeadline: post?.adsHeadline || '',
      adsDescription: post?.adsDescription || '',
      adsImage: post?.adsImage || '',
      utmCampaign: post?.utmCampaign || '',
      conversionLabel: post?.conversionLabel || '',
      status: post?.status || 'draft',
    },
  });

  const title = watch('title');

  useEffect(() => {
    categoriesApi
      .list()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!isEdit && title) {
      setValue('slug', slugify(title));
    }
  }, [title, isEdit, setValue]);

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      if (isEdit && post) {
        await postsApi.update(post.id, values);
      } else {
        await postsApi.create(values);
      }
      router.push('/admin/posts');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại');
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    if (!window.confirm('Xóa bài viết này?')) return;
    try {
      await postsApi.remove(post.id);
      router.push('/admin/posts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xóa thất bại');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {isEdit ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
        </Typography>
        <Stack direction="row" spacing={1}>
          {isEdit && (
            <Button color="error" variant="outlined" onClick={handleDelete}>
              Xóa
            </Button>
          )}
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </Stack>
      </Stack>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Stack spacing={2.5} sx={{ maxWidth: 960 }}>
        <TextField
          label="Tiêu đề"
          fullWidth
          {...register('title')}
          error={!!errors.title}
          helperText={errors.title?.message}
        />
        <TextField
          label="Slug"
          fullWidth
          {...register('slug')}
          error={!!errors.slug}
          helperText={errors.slug?.message}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.categoryId}>
                <InputLabel>Danh mục</InputLabel>
                <Select
                  {...field}
                  label="Danh mục"
                  value={field.value || ''}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                >
                  {categories.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select {...field} label="Trạng thái">
                  {statusOptions.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Stack>

        <TextField
          label="Mô tả ngắn"
          fullWidth
          multiline
          minRows={2}
          {...register('shortDescription')}
        />

        <Controller
          name="thumbnail"
          control={control}
          render={({ field }) => (
            <ImageUploader value={field.value} onChange={field.onChange} />
          )}
        />

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Nội dung
          </Typography>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <RichTextEditor value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.content && (
            <Typography color="error" variant="caption">
              {errors.content.message}
            </Typography>
          )}
        </Box>

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 700 }}>SEO cơ bản</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <TextField label="Meta title" fullWidth {...register('metaTitle')} />
              <TextField
                label="Meta description"
                fullWidth
                multiline
                minRows={2}
                {...register('metaDescription')}
              />
              <TextField
                label="Meta keywords (phẩy tách)"
                fullWidth
                {...register('metaKeywords')}
              />
              <TextField
                label="Focus keyword"
                fullWidth
                {...register('focusKeyword')}
                helperText="Từ khóa chính phục vụ SEO & MKT"
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Robots meta"
                  fullWidth
                  placeholder="index,follow"
                  {...register('robotsMeta')}
                />
                <TextField
                  label="Schema type"
                  fullWidth
                  placeholder="Article / Service / FAQPage"
                  {...register('schemaType')}
                />
              </Stack>
              <TextField
                label="Canonical URL"
                fullWidth
                {...register('canonicalUrl')}
              />
            </Stack>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 700 }}>
              Open Graph / Twitter (Social Ads)
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <TextField label="OG title" fullWidth {...register('ogTitle')} />
              <TextField
                label="OG description"
                fullWidth
                multiline
                minRows={2}
                {...register('ogDescription')}
              />
              <Controller
                name="ogImage"
                control={control}
                render={({ field }) => (
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary' }}
                    >
                      OG image
                    </Typography>
                    <ImageUploader value={field.value} onChange={field.onChange} />
                  </Box>
                )}
              />
              <TextField
                label="Twitter title"
                fullWidth
                {...register('twitterTitle')}
              />
              <TextField
                label="Twitter description"
                fullWidth
                multiline
                minRows={2}
                {...register('twitterDescription')}
              />
              <Controller
                name="twitterImage"
                control={control}
                render={({ field }) => (
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary' }}
                    >
                      Twitter image
                    </Typography>
                    <ImageUploader value={field.value} onChange={field.onChange} />
                  </Box>
                )}
              />
            </Stack>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 700 }}>
              Quảng cáo MKT (Google / Facebook Ads)
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <TextField
                label="Ads headline"
                fullWidth
                {...register('adsHeadline')}
                helperText="Headline dùng khi chạy quảng cáo"
              />
              <TextField
                label="Ads description"
                fullWidth
                multiline
                minRows={2}
                {...register('adsDescription')}
              />
              <Controller
                name="adsImage"
                control={control}
                render={({ field }) => (
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary' }}
                    >
                      Ads creative image
                    </Typography>
                    <ImageUploader value={field.value} onChange={field.onChange} />
                  </Box>
                )}
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="UTM campaign"
                  fullWidth
                  {...register('utmCampaign')}
                />
                <TextField
                  label="Conversion label (Google Ads)"
                  fullWidth
                  {...register('conversionLabel')}
                />
              </Stack>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Stack>
    </Box>
  );
}
