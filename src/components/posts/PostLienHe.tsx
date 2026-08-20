import { Box, Typography } from '@mui/material';
import type { Category } from '@/types';
import { brandColors } from '@/lib/theme';
import { CONTACT_MAP_EMBED_URL } from '@/lib/site';
import { contactChannelsApi } from '@/lib/api/contactChannelsApi';
import ContentWithSidebar from '@/components/layout/ContentWithSidebar';
import ContactForm from '@/components/contact/ContactForm';
import ContactChannelCards from '@/components/contact/ContactChannelCards';

interface PostLienHeProps {
  category: Category;
  /** URL embed Google Maps — mặc định CONTACT_MAP_EMBED_URL */
  mapEmbedUrl?: string;
}

export default async function PostLienHe({
  category,
  mapEmbedUrl = CONTACT_MAP_EMBED_URL,
}: PostLienHeProps) {
  const contacts = await contactChannelsApi.publicList().catch(() => []);

  return (
    <ContentWithSidebar>
      <Box
        sx={{
          p: { xs: 2, md: 3 },
          border: `1px solid ${brandColors.yellow}`,
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ mb: 3 }}>
          {category.content ? (
            <Box sx={{ mb: 2 }}>
              <Box
                className="post-content"
                sx={{
                  color: 'text.primary',
                  p: { xs: 2, md: 2.5 },
                  borderRadius: 0,
                  bgcolor: 'background.paper',
                  boxShadow: '0 4px 18px rgba(27, 41, 116, 0.12)',
                  '& .catedesc': { m: 0 },
                  '& p': { mb: 1.5 },
                  '& ul, & ol': { pl: 2.5, mb: 1.5 },
                  '& img': { maxWidth: '100%', height: 'auto' },
                }}
                dangerouslySetInnerHTML={{ __html: category.content }}
              />
            </Box>
          ) : null}
        </Box>

        <ContactChannelCards initialContacts={contacts} />

        <Box
          sx={{
            mb: 3,
            border: `1px solid ${brandColors.yellow}`,
            borderRadius: 0,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            boxShadow: '0 4px 18px rgba(27, 41, 116, 0.08)',
          }}
        >
          <Box
            component="iframe"
            title="Bản đồ liên hệ Gllogistics"
            src={mapEmbedUrl}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            sx={{
              display: 'block',
              width: '100%',
              height: { xs: 260, md: 450 },
              border: 0,
            }}
          />
        </Box>

        <Box
          sx={{
            p: { xs: 2.5, md: 3.5 },
            borderRadius: 0,
            bgcolor: 'background.paper',
            border: `1px solid ${brandColors.border}`,
            boxShadow: '0 4px 18px rgba(27, 41, 116, 0.08)',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Gửi yêu cầu liên hệ
          </Typography>
          <ContactForm sourcePage={`/${category.slug}`} />
        </Box>
      </Box>
    </ContentWithSidebar>
  );
}
