'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#60a5fa',
      light: '#93c5fd',
      dark: '#3b82f6',
      contrastText: '#0f172a',
    },
    secondary: {
      main: '#64748b',
      light: '#94a3b8',
      dark: '#475569',
    },
    background: {
      default: '#060910',
      paper: '#070c14',
    },
    text: {
      primary: '#e8eff7',
      secondary: '#94a3b8',
      disabled: 'rgba(225,237,247,0.38)',
    },
    divider: 'rgba(59, 130, 246, 0.22)',
    error: { main: '#f87171' },
    warning: { main: '#fbbf24' },
    info: { main: '#60a5fa' },
    success: { main: '#34d399' },
    action: {
      active: '#93c5fd',
      hover: 'rgba(96,165,250,0.08)',
      selected: 'rgba(96,165,250,0.16)',
      disabledBackground: 'rgba(225,237,247,0.06)',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily:
      'var(--font-sans-modern), Inter, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none !important',
          backgroundColor: '#070c14',
          borderColor: 'rgba(59, 130, 246, 0.28)',
          borderRadius: '12px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundImage: 'linear-gradient(180deg, #121a2b 0%, #0a0f1a 100%)',
          color: '#e5edf9',
          border: '1px solid rgba(59, 130, 246, 0.45)',
          boxShadow:
            '0 0 16px rgba(37, 99, 235, 0.45), 0 0 36px rgba(37, 99, 235, 0.25), inset 0 1px 0 rgba(160, 192, 240, 0.07)',
          '&:hover': {
            backgroundImage: 'linear-gradient(180deg, #1a2538 0%, #0f1624 100%)',
            boxShadow:
              '0 0 22px rgba(59, 130, 246, 0.55), 0 0 48px rgba(37, 99, 235, 0.3), inset 0 1px 0 rgba(160, 192, 240, 0.09)',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          '&::before': {
            borderBottomColor: 'rgba(148,163,184,0.42) !important',
          },
          '&::after': {
            borderBottomColor: '#60a5fa',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(59, 130, 246, 0.25)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(59, 130, 246, 0.42)',
          },
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none !important',
          backgroundColor: '#070c14',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none !important',
          backgroundColor: '#070c14',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none !important',
          backgroundColor: '#070c14',
          border: '1px solid rgba(59, 130, 246, 0.28)',
          boxShadow: '0 0 40px rgba(37, 99, 235, 0.2), 0 8px 28px rgba(0, 0, 0, 0.5)',
        },
      },
    },
  },
});

export function MuiThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
}
