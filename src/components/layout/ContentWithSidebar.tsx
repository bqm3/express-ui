import { Box, Container, Grid } from '@mui/material';
import ContentSidebar from '@/components/layout/ContentSidebar';

export default function ContentWithSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 9 }}>{children}</Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <ContentSidebar />
        </Grid>
      </Grid>
    </Container>
  );
}
