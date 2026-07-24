import { Box, Chip, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import type { Post } from '@/types';
import { brandColors } from '@/lib/theme';
import ContactForm from '@/components/contact/ContactForm';
import ContentWithSidebar from '@/components/layout/ContentWithSidebar';

interface PostDetailProps {
  post: Post;
}

export default function PostDetail({ post }: PostDetailProps) {
  const isContactPage = post.slug === 'lien-he';

  return (
    <ContentWithSidebar>
      <Stack spacing={2} sx={{ mb: 3 }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Chip
            size="small"
            label={post.category?.name || 'Bài viết'}
            sx={{
              bgcolor: 'rgba(11, 110, 79, 0.1)',
              color: brandColors.teal,
              fontWeight: 600,
            }}
          />
          {/* {post.publishedAt && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {dayjs(post.publishedAt).format('DD/MM/YYYY HH:mm')}
            </Typography>
          )}
          {!isContactPage && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              · {post.viewCount} lượt xem
            </Typography>
          )} */}
        </Stack>

        <Typography
          variant="h3"
          component="h1"
          sx={{ fontSize: { xs: '1.75rem', md: '2.35rem' } }}
        >
          {post.title}
        </Typography>

        {post.shortDescription && (
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              fontWeight: 400,
            }}
          >
            {post.shortDescription}
          </Typography>
        )}
      </Stack>
      {post.thumbnail && (
        <Box
          component="img"
          src={post.thumbnail}
          alt={post.title}
          sx={{
            width: '100%',
            maxHeight: 420,
            objectFit: 'cover',
            borderRadius: 2,
            mb: 4,
            border: `1px solid ${brandColors.border}`,
          }}
        />
      )}
      <Box
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
        sx={{
          '& p': { mb: 2, lineHeight: 1.8 },
          '& h2, & h3, & h4': {
            fontFamily:
              'var(--font-hanken-grotesk), "Hanken Grotesk", sans-serif',
            mt: 3,
            mb: 1.5,
          },
          '& img': {
            maxWidth: '100%',
            height: 'auto',
            borderRadius: 1.5,
            my: 2,
          },
          '& a': { color: brandColors.teal, textDecoration: 'underline' },
          '& ul, & ol': { pl: 3, mb: 2 },
          '& blockquote': {
            borderLeft: `3px solid ${brandColors.amber}`,
            pl: 2,
            ml: 0,
            color: 'text.secondary',
            fontStyle: 'italic',
          },
        }}
      />
      {isContactPage && (
        <Box
          sx={{
            mt: 4,
            p: { xs: 2.5, md: 3.5 },
            borderRadius: 2,
            bgcolor: 'background.paper',
            border: `1px solid ${brandColors.border}`,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            Gửi yêu cầu liên hệ
          </Typography>
          <ContactForm sourcePage={`/${post.slug}`} />
        </Box>
      )}
    </ContentWithSidebar>
  );
}
