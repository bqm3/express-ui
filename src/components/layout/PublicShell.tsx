import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import BackToTop from './BackToTop';
import FloatingContactButtons from '@/components/contact/FloatingContactButtons';

import type { ContactChannel, MenuCategoryItem, SiteSettings } from '@/types';

interface PublicShellProps {
  children: React.ReactNode;
  initialMenu?: MenuCategoryItem[];
  initialContacts?: ContactChannel[];
  initialSettings?: SiteSettings;
}

export default function PublicShell({
  children,
  initialMenu,
  initialContacts,
  initialSettings,
}: PublicShellProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header initialMenu={initialMenu} settings={initialSettings} />
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      <Footer settings={initialSettings} />
      <BackToTop />
      <FloatingContactButtons initialContacts={initialContacts} />
    </Box>
  );
}

