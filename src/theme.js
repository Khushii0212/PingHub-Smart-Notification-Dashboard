/**
 * PingHub Light Theme — bright, cheerful, and professional.
 * Clean white surfaces, soft lavender canvas, vibrant indigo accent.
 * Inspired by modern EdTech / SaaS dashboards (Notion, Linear, Vercel).
 */

import { createTheme, alpha } from '@mui/material/styles';

export const tokens = {
  bg: {
    canvas:  '#F0F2FF',   // soft indigo-tinted background
    surface: '#FFFFFF',   // card & sidebar surfaces
    raised:  '#F8F9FF',   // subtle elevation
    input:   '#F5F7FF',   // form inputs
  },

  indigo: {
    50:   '#EEF2FF',
    100:  '#E0E7FF',
    200:  '#C7D2FE',
    400:  '#818CF8',
    500:  '#6366F1',
    600:  '#4F46E5',
    700:  '#4338CA',
    glow: 'rgba(99,102,241,0.10)',
    ring: 'rgba(99,102,241,0.28)',
    text: '#4F46E5',
  },

  type: {
    Placement: {
      main:  '#059669',
      dark:  '#047857',
      bg:    '#ECFDF5',
      ring:  'rgba(5,150,105,0.22)',
      text:  '#065F46',
    },
    Result: {
      main:  '#2563EB',
      dark:  '#1D4ED8',
      bg:    '#EFF6FF',
      ring:  'rgba(37,99,235,0.22)',
      text:  '#1E3A8A',
    },
    Event: {
      main:  '#D97706',
      dark:  '#B45309',
      bg:    '#FFFBEB',
      ring:  'rgba(217,119,6,0.22)',
      text:  '#92400E',
    },
  },

  text: {
    primary:   '#111827',
    secondary: '#4B5563',
    tertiary:  '#9CA3AF',
    inverse:   '#FFFFFF',
    link:      '#4F46E5',
  },

  line: {
    hairline: '#F3F4F6',
    subtle:   '#E5E7EB',
    default:  '#D1D5DB',
    strong:   '#9CA3AF',
    accent:   'rgba(99,102,241,0.25)',
  },

  shadow: {
    xs: '0 1px 2px rgba(0,0,0,0.05)',
    sm: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
    md: '0 4px 6px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)',
    lg: '0 10px 15px rgba(0,0,0,0.07), 0 4px 6px rgba(0,0,0,0.04)',
    xl: '0 20px 25px rgba(0,0,0,0.08), 0 10px 10px rgba(0,0,0,0.03)',
    focus: `0 0 0 3px rgba(99,102,241,0.2)`,
  },

  // Deadline urgency
  urgency: {
    critical: { bg: '#FEF2F2', color: '#DC2626', ring: 'rgba(220,38,38,0.2)' },
    warning:  { bg: '#FFFBEB', color: '#D97706', ring: 'rgba(217,119,6,0.2)' },
    safe:     { bg: '#ECFDF5', color: '#059669', ring: 'rgba(5,150,105,0.2)' },
  },
};

// ── MUI Theme ──────────────────────────────────────────────────────────────────
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main:  tokens.indigo[500],
      light: tokens.indigo[400],
      dark:  tokens.indigo[600],
    },
    background: {
      default: tokens.bg.canvas,
      paper:   tokens.bg.surface,
    },
    text: {
      primary:   tokens.text.primary,
      secondary: tokens.text.secondary,
    },
    divider: tokens.line.subtle,
    error:   { main: '#DC2626' },
    warning: { main: '#D97706' },
    success: { main: '#059669' },
    info:    { main: '#2563EB' },
  },

  typography: {
    fontFamily: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
    h1: { fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2 },
    h2: { fontSize: '1.375rem', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.3, color: tokens.text.primary },
    h3: { fontSize: '1.125rem', fontWeight: 600, letterSpacing: '-0.015em', color: tokens.text.primary },
    h4: { fontSize: '0.9375rem', fontWeight: 600, color: tokens.text.primary },
    h5: { fontSize: '0.875rem', fontWeight: 600, color: tokens.text.primary },
    h6: { fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: tokens.text.tertiary },
    body1: { fontSize: '0.9375rem', lineHeight: 1.65, letterSpacing: '-0.005em' },
    body2: { fontSize: '0.8125rem', lineHeight: 1.6, color: tokens.text.secondary },
    caption: { fontSize: '0.72rem', color: tokens.text.tertiary, letterSpacing: '0.01em' },
    overline: { fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', color: tokens.text.tertiary },
  },

  shape: { borderRadius: 10 },

  shadows: [
    'none',
    tokens.shadow.xs,
    tokens.shadow.sm,
    tokens.shadow.md,
    tokens.shadow.lg,
    tokens.shadow.xl,
    ...Array(19).fill('none'),
  ],

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { scrollBehavior: 'smooth' },
        body: {
          background: `
            radial-gradient(ellipse 70% 50% at 5% -10%, rgba(99,102,241,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 95% 105%, rgba(5,150,105,0.05) 0%, transparent 55%),
            ${tokens.bg.canvas}
          `,
          minHeight: '100vh',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        '::selection': {
          background: tokens.indigo[200],
          color: tokens.indigo[700],
        },
        '::-webkit-scrollbar': { width: 6, height: 6 },
        '::-webkit-scrollbar-track': { background: tokens.bg.canvas },
        '::-webkit-scrollbar-thumb': {
          background: tokens.line.default,
          borderRadius: 3,
        },
        '::-webkit-scrollbar-thumb:hover': { background: tokens.line.strong },
      },
    },

    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          background: tokens.bg.surface,
          border: `1px solid ${tokens.line.subtle}`,
          borderRadius: 12,
          boxShadow: tokens.shadow.sm,
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
          '&:hover': {
            borderColor: tokens.indigo[200],
            boxShadow: `${tokens.shadow.md}, 0 0 0 1px ${tokens.indigo[200]}`,
            transform: 'translateY(-1px)',
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          letterSpacing: '-0.01em',
          fontSize: '0.875rem',
        },
        containedPrimary: {
          background: `linear-gradient(145deg, ${tokens.indigo[500]} 0%, ${tokens.indigo[600]} 100%)`,
          color: '#fff',
          boxShadow: `0 2px 8px ${alpha(tokens.indigo[500], 0.35)}`,
          '&:hover': {
            boxShadow: `0 4px 14px ${alpha(tokens.indigo[500], 0.5)}`,
            background: `linear-gradient(145deg, ${tokens.indigo[400]} 0%, ${tokens.indigo[500]} 100%)`,
          },
        },
        outlinedPrimary: {
          borderColor: tokens.indigo[200],
          color: tokens.indigo[600],
          '&:hover': {
            background: tokens.indigo[50],
            borderColor: tokens.indigo[400],
          },
        },
        textPrimary: {
          color: tokens.indigo[600],
          '&:hover': { background: tokens.indigo[50] },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.72rem',
          letterSpacing: '0.01em',
          borderRadius: 6,
          height: 24,
        },
        sizeSmall: { height: 20 },
      },
    },

    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            borderRadius: 8,
            fontWeight: 600,
            fontSize: '0.8125rem',
            border: `1px solid ${tokens.line.subtle}`,
            color: tokens.text.secondary,
            '&:hover': {
              background: tokens.indigo[50],
              borderColor: tokens.indigo[200],
              color: tokens.indigo[600],
            },
            '&.Mui-selected': {
              background: `linear-gradient(145deg, ${tokens.indigo[500]}, ${tokens.indigo[600]})`,
              color: '#fff',
              border: 'none',
              boxShadow: `0 2px 8px ${alpha(tokens.indigo[500], 0.4)}`,
            },
          },
        },
      },
    },

    MuiSlider: {
      styleOverrides: {
        root: { color: tokens.indigo[500] },
        rail: { background: tokens.line.subtle, opacity: 1 },
        markLabel: { fontSize: '0.7rem', color: tokens.text.tertiary, fontWeight: 500 },
        thumb: {
          '&:hover, &.Mui-focusVisible': {
            boxShadow: tokens.shadow.focus,
          },
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: tokens.text.primary,
          color: '#fff',
          fontSize: '0.72rem',
          fontWeight: 500,
          borderRadius: 6,
          padding: '5px 10px',
        },
        arrow: { '&::before': { background: tokens.text.primary } },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: tokens.bg.surface,
          borderLeft: `1px solid ${tokens.line.subtle}`,
          boxShadow: `-4px 0 24px rgba(0,0,0,0.08)`,
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 3, background: tokens.line.subtle },
        bar: {
          borderRadius: 3,
          background: `linear-gradient(90deg, ${tokens.indigo[500]}, ${tokens.indigo[400]})`,
        },
      },
    },

    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          background: alpha(tokens.bg.surface, 0.92),
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${tokens.line.subtle}`,
          color: tokens.text.primary,
        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        root: {
          background: tokens.bg.input,
          borderRadius: 8,
          fontSize: '0.875rem',
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: { borderColor: tokens.line.subtle },
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: tokens.line.default },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: tokens.indigo[400],
            boxShadow: tokens.shadow.focus,
          },
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.18s ease',
        },
      },
    },

    MuiBottomNavigation: {
      styleOverrides: {
        root: { background: tokens.bg.surface, borderTop: `1px solid ${tokens.line.subtle}` },
      },
    },

    MuiSelect: {
      styleOverrides: {
        root: { background: tokens.bg.input },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: { borderColor: tokens.line.subtle },
      },
    },
  },
});

export default theme;
