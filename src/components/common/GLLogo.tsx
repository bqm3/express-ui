import { Box, Typography } from '@mui/material';
import { brandColors, brandFonts } from '@/lib/theme';

interface GLLogoIconProps {
  size?: number;
}

export function GLLogoIcon({ size = 48 }: GLLogoIconProps) {
  return (
    <Box
      component="img"
      src="/logo.png"
      alt="GIA LONG LOGISTICS"
      sx={{
        height: size,
        width: 'auto',
        display: 'block',
        flexShrink: 0,
      }}
    />
  );
}

interface GLLogoProps {
  size?: number;
  variant?: 'light' | 'dark' | 'auto';
  showSubtitle?: boolean;
}

export default function GLLogo({
  size = 48,
  variant = 'auto',
  showSubtitle = true,
}: GLLogoProps) {
  const isDark = variant === 'dark';

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.25,
        textDecoration: 'none',
        userSelect: 'none',
      }}
    >
      <GLLogoIcon size={size} />

      <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Typography
          component="span"
          sx={{
            fontFamily: brandFonts.headline,
            fontWeight: 800,
            fontSize: size >= 48 ? { xs: '1.05rem', md: '1.35rem' } : '1rem',
            color: isDark ? '#ffffff' : brandColors.primaryContainer,
            letterSpacing: '0.03em',
            lineHeight: 1.1,
            whiteSpace: 'nowrap',
          }}
        >
          GIA LONG LOGISTICS
        </Typography>

        {showSubtitle && (
          <Typography
            variant="caption"
            sx={{
              color: isDark ? 'rgba(255, 255, 255, 0.75)' : brandColors.onSurfaceVariant,
              fontFamily: brandFonts.labelCaps,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontSize: { xs: '0.62rem', md: '0.68rem' },
              mt: 0.35,
              lineHeight: 1.1,
              whiteSpace: 'nowrap',
            }}
          >
            CÔNG TY TNHH GIA LONG LOGISTICS VIỆT NAM
          </Typography>
        )}
      </Box>
    </Box>
  );
}
