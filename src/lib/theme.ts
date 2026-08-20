import { createTheme } from '@mui/material/styles';

/** Velocity Logistic Identity — Brand tokens */
export const brandColors = {
  // Core theme tokens
  surface: '#f9f9ff',
  surfaceDim: '#cfdaf2',
  surfaceBright: '#f9f9ff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f0f3ff',
  surfaceLow: '#f0f3ff',
  surfaceContainer: '#e7eeff',
  surfaceContainerHigh: '#dee8ff',
  surfaceContainerHighest: '#d8e3fb',
  onSurface: '#111c2d',
  onSurfaceVariant: '#3e4945',
  inverseSurface: '#263143',
  inverseOnSurface: '#ecf1ff',
  outline: '#6e7a75',
  outlineVariant: '#bdc9c4',
  surfaceTint: '#006b57',

  primary: '#00614f',
  onPrimary: '#ffffff',
  primaryContainer: '#0d7c66',
  onPrimaryContainer: '#bbffe9',
  inversePrimary: '#7bd7bd',

  secondary: '#9d4300',
  onSecondary: '#ffffff',
  secondaryContainer: '#fd761a',
  onSecondaryContainer: '#5c2400',

  tertiary: '#21604c',
  onTertiary: '#ffffff',
  tertiaryContainer: '#3c7964',
  onTertiaryContainer: '#c0ffe5',

  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',

  primaryFixed: '#97f4d9',
  primaryFixedDim: '#7bd7bd',
  onPrimaryFixed: '#002019',
  onPrimaryFixedVariant: '#005141',

  secondaryFixed: '#ffdbca',
  secondaryFixedDim: '#ffb690',
  onSecondaryFixed: '#341100',
  onSecondaryFixedVariant: '#783200',

  tertiaryFixed: '#b0f0d6',
  tertiaryFixedDim: '#95d3ba',
  onTertiaryFixed: '#002117',
  onTertiaryFixedVariant: '#0b513d',

  background: '#f9f9ff',
  onBackground: '#111c2d',
  surfaceVariant: '#d8e3fb',
  surfaceWhite: '#FFFFFF',
  forestDeep: '#064E3B',
  velocityOrange: '#F97316',
  slateText: '#1E293B',

  // Backward-compatible aliases (existing components)
  blue: '#0d7c66',
  blueDark: '#00614f',
  blueLight: '#006b57',
  yellow: '#F97316',
  yellowDark: '#9d4300',
  red: '#ba1a1a',
  navy: '#064E3B',
  navyMuted: '#3e4945',
  offWhite: '#f9f9ff',
  mist: '#f0f3ff',
  white: '#ffffff',
  border: '#bdc9c4',
  surfaceBorder: '#bdc9c4',
  surfaceLowest: '#ffffff',
  teal: '#0d7c66',
  tealDark: '#00614f',
  tealLight: '#006b57',
  amber: '#F97316',
  amberDark: '#9d4300',
  gold: '#F97316',
  brandGoldLight: '#ffdbca',
  brandBlueDark: '#064E3B',
  statusError: '#ba1a1a',
  statusSuccess: '#0d7c66',
};

export const brandFonts = {
  headline: 'var(--font-be-vietnam-pro), "Be Vietnam Pro", sans-serif',
  body: 'var(--font-be-vietnam-pro), "Be Vietnam Pro", sans-serif',
  labelCaps: 'var(--font-archivo-narrow), "Archivo Narrow", sans-serif',
  code: 'var(--font-jetbrains-mono), "JetBrains Mono", monospace',
};

export const brandShadow = {
  level2: '0px 4px 20px rgba(13, 124, 102, 0.08)',
};

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: {
      main: brandColors.primaryContainer,
      dark: brandColors.primary,
      light: brandColors.inversePrimary,
      contrastText: brandColors.onPrimary,
    },
    secondary: {
      main: brandColors.velocityOrange,
      dark: brandColors.secondary,
      light: brandColors.secondaryFixedDim,
      contrastText: brandColors.onSecondary,
    },
    error: {
      main: brandColors.error,
      contrastText: brandColors.onError,
    },
    success: {
      main: brandColors.primaryContainer,
    },
    background: {
      default: brandColors.background,
      paper: brandColors.surfaceWhite,
    },
    text: {
      primary: brandColors.onSurface,
      secondary: brandColors.onSurfaceVariant,
    },
    divider: brandColors.outlineVariant,
  },
  typography: {
    fontFamily: brandFonts.body,
    h1: {
      fontFamily: brandFonts.headline,
      fontWeight: 700,
      fontSize: '3rem', // 48px
      lineHeight: '3.5rem', // 56px
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: brandFonts.headline,
      fontWeight: 700,
      fontSize: '2rem', // 32px
      lineHeight: '2.5rem', // 40px
    },
    h3: {
      fontFamily: brandFonts.headline,
      fontWeight: 600,
      fontSize: '1.5rem', // 24px
      lineHeight: '2rem', // 32px
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
      fontSize: '1.125rem',
      lineHeight: '1.5rem',
    },
    h6: {
      fontFamily: brandFonts.headline,
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: '1.5rem',
    },
    body1: {
      fontFamily: brandFonts.body,
      fontSize: '1.125rem', // 18px (body-lg)
      fontWeight: 400,
      lineHeight: '1.75rem', // 28px
    },
    body2: {
      fontFamily: brandFonts.body,
      fontSize: '1rem', // 16px (body-md)
      fontWeight: 400,
      lineHeight: '1.5rem', // 24px
    },
    overline: {
      fontFamily: brandFonts.labelCaps,
      fontSize: '0.875rem', // 14px (label-caps)
      fontWeight: 600,
      letterSpacing: '0.05em',
      lineHeight: '1.25rem', // 20px
      textTransform: 'uppercase',
    },
    button: {
      fontFamily: brandFonts.body,
      fontWeight: 600,
      fontSize: '1rem', // 16px
      lineHeight: '1.5rem', // 24px
      textTransform: 'none',
    },
  },
  shape: { borderRadius: 6 },
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
          borderRadius: 6,
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
            backgroundColor: brandColors.velocityOrange,
            color: brandColors.onSecondary,
            fontWeight: 600,
            '&:hover': { backgroundColor: brandColors.secondaryContainer },
          },
        },
        {
          props: { variant: 'outlined', color: 'primary' },
          style: {
            borderColor: brandColors.outlineVariant,
            color: brandColors.primaryContainer,
            '&:hover': { borderColor: brandColors.primaryContainer },
          },
        },
      ],
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          backgroundImage: 'none',
        },
        outlined: {
          borderColor: brandColors.outlineVariant,
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
          border: `1px solid ${brandColors.outlineVariant}`,
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
            borderRadius: 6,
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
          borderRadius: 6,
          fontFamily: brandFonts.labelCaps,
          fontWeight: 600,
          fontSize: '0.875rem',
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
