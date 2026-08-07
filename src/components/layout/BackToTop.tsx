'use client';

import { useEffect, useState } from 'react';
import { Fab, Zoom } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { brandColors } from '@/lib/theme';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 280) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Zoom in={visible}>
      <Fab
        size="medium"
        aria-label="Về đầu trang"
        onClick={scrollToTop}
        sx={{
          position: 'fixed',
          bottom: { xs: 20, md: 28 },
          left: { xs: 16, md: 24 },
          zIndex: 1200,
          borderRadius: '50%',
          bgcolor: brandColors.primaryContainer,
          color: '#ffffff',
          boxShadow: '0 4px 16px rgba(13, 124, 102, 0.4)',
          transition: 'all 0.25s ease',
          '&:hover': {
            bgcolor: brandColors.primary,
            transform: 'scale(1.12)',
            boxShadow: '0 8px 24px rgba(13, 124, 102, 0.6)',
          },
        }}
      >
        <KeyboardArrowUpIcon sx={{ fontSize: 24 }} />
      </Fab>
    </Zoom>
  );
}
