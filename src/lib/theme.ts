import { createTheme } from '@mui/material/styles';

/** Velocity Logistics System — brand tokens */
export const brandColors = {
  // Core brand
  primary: '#1b2974',
  primaryContainer: '#34418c',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#a6b1ff',
  inversePrimary: '#bbc3ff',
  surfaceTint: '#4c58a5',
  brandBlueDark: '#263066',

  secondary: '#7d5700',
  secondaryContainer: '#feb71a',
  onSecondary: '#ffffff',
  onSecondaryContainer: '#6b4b00',
  brandGoldLight: '#FDF4B8',
  gold: '#FFB81C',

  tertiary: '#4e2700',
  tertiaryContainer: '#6f3a00',
  onTertiary: '#ffffff',
  onTertiaryContainer: '#f2a666',

  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  statusError: '#D32F2F',
  statusSuccess: '#2E7D32',

  background: '#f8f9fb',
  onBackground: '#191c1e',
  surface: '#f8f9fb',
  surfaceDim: '#d9dadc',
  surfaceBright: '#f8f9fb',
  surfaceLowest: '#ffffff',
  surfaceLow: '#f3f4f6',
  surfaceContainer: '#edeef0',
  surfaceHigh: '#e7e8ea',
  surfaceHighest: '#e1e2e4',
  surfaceVariant: '#e1e2e4',
  onSurface: '#191c1e',
  onSurfaceVariant: '#454651',
  inverseSurface: '#2e3132',
  inverseOnSurface: '#f0f1f3',
  outline: '#767682',
  outlineVariant: '#c6c5d2',
  surfaceBorder: '#E6E6E6',

  // Backward-compatible aliases (existing components)
  blue: '#34418c',
  blueDark: '#1b2974',
  blueLight: '#4c58a5',
  yellow: '#FFB81C',
  yellowDark: '#7d5700',
  red: '#ba1a1a',
  navy: '#263066',
  navyMuted: '#454651',
  offWhite: '#f8f9fb',
  mist: '#f3f4f6',
  white: '#ffffff',
  border: '#E6E6E6',
  teal: '#34418c',
  tealDark: '#1b2974',
  tealLight: '#4c58a5',
  amber: '#FFB81C',
  amberDark: '#7d5700',
};

export const brandFonts = {
  headline: 'var(--font-hanken-grotesk), "Hanken Grotesk", sans-serif',
  body: 'var(--font-inter), Inter, sans-serif',
  code: 'var(--font-jetbrains-mono), "JetBrains Mono", monospace',
};

export const brandShadow = {
  level2: '0px 4px 20px rgba(52, 65, 140, 0.08)',
};

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: {
      main: brandColors.primaryContainer,
      dark: brandColors.primary,
      light: brandColors.surfaceTint,
      contrastText: brandColors.onPrimary,
    },
    secondary: {
      main: brandColors.gold,
      dark: brandColors.secondary,
      light: brandColors.brandGoldLight,
      contrastText: brandColors.primary,
    },
    error: {
      main: brandColors.error,
      contrastText: brandColors.onError,
    },
    success: {
      main: brandColors.statusSuccess,
    },
    background: {
      default: brandColors.background,
      paper: brandColors.surfaceLowest,
    },
    text: {
      primary: brandColors.onSurface,
      secondary: brandColors.onSurfaceVariant,
    },
    divider: brandColors.surfaceBorder,
  },
  typography: {
    fontFamily: brandFonts.body,
    h1: {
      fontFamily: brandFonts.headline,
      fontWeight: 800,
      fontSize: '3rem',
      lineHeight: '3.5rem',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: brandFonts.headline,
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: '2.5rem',
    },
    h3: {
      fontFamily: brandFonts.headline,
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: '2rem',
    },
    h4: {
      fontFamily: brandFonts.headline,
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: '1.75rem',
    },
    h5: {
      fontFamily: brandFonts.headline,
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: '1.75rem',
    },
    h6: {
      fontFamily: brandFonts.headline,
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: '1.5rem',
    },
    body1: {
      fontFamily: brandFonts.body,
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: '1.5rem',
    },
    body2: {
      fontFamily: brandFonts.body,
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: '1.25rem',
    },
    overline: {
      fontFamily: brandFonts.body,
      fontSize: '0.75rem',
      fontWeight: 700,
      letterSpacing: '0.05em',
      lineHeight: '1rem',
      textTransform: 'uppercase',
    },
    button: {
      fontFamily: brandFonts.body,
      fontWeight: 700,
      fontSize: '0.75rem',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      lineHeight: '1rem',
    },
  },
  shape: { borderRadius: 4 },
  shadows: [
    'none',
    brandShadow.level2,
    brandShadow.level2,
    brandShadow.level2,
    brandShadow.level2,
    brandShadow.level2,
    brandShadow.level2,
    brandShadow.level2,
    brandShadow.level2,
    brandShadow.level2,
    brandShadow.level2,
    brandShadow.level2,
    brandShadow.level2,
    brandShadow.level2,
    brandShadow.level2,
    brandShadow.level2,
    brandShadow.level2,
    brandShadow.level2,
    brandShadow.level2,
    brandShadow.level2,
    brandShadow.level2,
    brandShadow.level2,
    brandShadow.level2,
    brandShadow.level2,
    brandShadow.level2,
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            backgroundColor: brandColors.primaryContainer,
            color: brandColors.onPrimary,
            '&:hover': { backgroundColor: brandColors.primary },
          },
        },
        {
          props: { variant: 'contained', color: 'secondary' },
          style: {
            backgroundColor: brandColors.gold,
            color: brandColors.primary,
            fontWeight: 700,
            '&:hover': { backgroundColor: brandColors.secondaryContainer },
          },
        },
        {
          props: { variant: 'outlined', color: 'primary' },
          style: {
            borderColor: brandColors.primaryContainer,
            color: brandColors.primaryContainer,
          },
        },
      ],
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundImage: 'none',
        },
        outlined: {
          borderColor: brandColors.surfaceBorder,
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        square: true,
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: `1px solid ${brandColors.surfaceBorder}`,
          boxShadow: 'none',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: 2,
              borderColor: brandColors.primaryContainer,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontFamily: brandFonts.body,
          fontWeight: 700,
          fontSize: '0.75rem',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: brandColors.background,
          color: brandColors.onBackground,
          minHeight: '100vh',
        },
        a: {
          color: 'inherit',
          textDecoration: 'none',
        },
      },
    },
  },
});

export default theme;
