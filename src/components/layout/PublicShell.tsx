import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import BackToTop from './BackToTop';
import FloatingContactButtons from '@/components/contact/FloatingContactButtons';

import type { ContactChannel, MenuCategoryItem } from '@/types';

interface PublicShellProps {
  children: React.ReactNode;
  initialMenu?: MenuCategoryItem[];
  initialContacts?: ContactChannel[];
}

export default function PublicShell({
  children,
  initialMenu,
  initialContacts,
}: PublicShellProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header initialMenu={initialMenu} />
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      <Footer />
      <BackToTop />
      <FloatingContactButtons initialContacts={initialContacts} />
    </Box>
  );
}
