import { Box, Typography } from '@mui/material';
import { brandColors, brandFonts } from '@/lib/theme';

interface GLLogoIconProps {
  size?: number;
}

/**
 * Modern High-Tech Global Logistics Logo Icon (GL Monogram + Supersonic Flight Wing + Velocity Chevrons)
 */
export function GLLogoIcon({ size = 48 }: GLLogoIconProps) {
  return (
    <Box
      component="svg"
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      sx={{
        width: size,
        height: size,
        display: 'block',
        flexShrink: 0,
        filter: 'drop-shadow(0 4px 12px rgba(13, 124, 102, 0.28))',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      }}
      aria-label="Gia Long Logistics Logo"
    >
      <defs>
        {/* Background Shield Gradients */}
        <linearGradient id="gl-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#043d2e" />
          <stop offset="50%" stopColor="#0d7c66" />
          <stop offset="100%" stopColor="#005242" />
        </linearGradient>

        {/* Velocity Wing Gradient (Orange / Amber Glow) */}
        <linearGradient id="gl-wing-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="60%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>

        {/* Emerald Cyan Monogram Stream */}
        <linearGradient id="gl-stream-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="50%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>

        {/* Subtle Top Bevel Highlight */}
        <linearGradient id="gl-bevel-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Hexagonal Dynamic Badge Container */}
      <path
        d="M26 2L48 12.5V39.5L26 50L4 39.5V12.5L26 2Z"
        fill="url(#gl-bg-grad)"
      />
      {/* Outer Border Stroke */}
      <path
        d="M26 2L48 12.5V39.5L26 50L4 39.5V12.5L26 2Z"
        stroke="rgba(255, 255, 255, 0.22)"
        strokeWidth="1.5"
      />
      {/* Top Half Highlight Bevel */}
      <path
        d="M26 2L48 12.5V26L4 26V12.5L26 2Z"
        fill="url(#gl-bevel-grad)"
        opacity="0.25"
      />

      {/* Dynamic Stylized "G" Geometric Loop */}
      <path
        d="M13 19C13 15.5 16 12 21 12H32L28 16H21C18 16 17 17.5 17 19.5V32.5C17 34.5 18 36 21 36H30V26H24L26 22H34V38C34 39.5 32.5 40 30 40H21C16 40 13 36.5 13 32.5V19Z"
        fill="url(#gl-stream-grad)"
      />

      {/* Supersonic Cargo Flight Wing (Letter "L" / Velocity Jet Stream) */}
      <path
        d="M23 11L43 21L29 27L47 36L21 36L31 29L16 22L23 11Z"
        fill="url(#gl-wing-grad)"
        filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
      />

      {/* Speed Accent Points */}
      <circle cx="43" cy="21" r="2" fill="#ffffff" />
      <polygon points="46,14 42,16 44,18" fill="#fbbf24" />
    </Box>
  );
}

interface GLLogoProps {
  size?: number;
  variant?: 'light' | 'dark' | 'auto';
  showSubtitle?: boolean;
}

/**
 * Complete GLLogistics Brand Logo Component with Typography
 */
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
        gap: 1.5,
        textDecoration: 'none',
        userSelect: 'none',
      }}
    >
      <GLLogoIcon size={size} />

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.25 }}>
          <Typography
            component="span"
            sx={{
              fontFamily: brandFonts.headline,
              fontWeight: 900,
              fontSize: size >= 48 ? { xs: '1.25rem', md: '1.45rem' } : '1.15rem',
              color: isDark ? '#ffffff' : brandColors.primaryContainer,
              letterSpacing: '0.04em',
              lineHeight: 1,
            }}
          >
            GL
          </Typography>
          <Typography
            component="span"
            sx={{
              fontFamily: brandFonts.headline,
              fontWeight: 800,
              fontSize: size >= 48 ? { xs: '1.25rem', md: '1.45rem' } : '1.15rem',
              color: brandColors.velocityOrange,
              letterSpacing: '0.04em',
              lineHeight: 1,
            }}
          >
            LOGISTICS
          </Typography>
          <Box
            sx={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              bgcolor: brandColors.velocityOrange,
              ml: 0.35,
              mb: 0.5,
              alignSelf: 'flex-end',
            }}
          />
        </Box>

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
