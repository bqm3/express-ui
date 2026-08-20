import { Container, Grid } from '@mui/material';
import ContentSidebar from '@/components/layout/ContentSidebar';
import { categoriesApi } from '@/lib/api/categoriesApi';
import { contactChannelsApi } from '@/lib/api/contactChannelsApi';

export default async function ContentWithSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarBlocks, contacts] = await Promise.all([
    categoriesApi.sidebar().catch(() => []),
    contactChannelsApi.publicList().catch(() => []),
  ]);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 9 }}>{children}</Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <ContentSidebar initialBlocks={sidebarBlocks} initialContacts={contacts} />
        </Grid>
      </Grid>
    </Container>
  );
}
