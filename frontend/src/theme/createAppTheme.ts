import { createTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

const commonShape = { borderRadius: 12 };

const commonTypography = {
  fontFamily:
    'var(--font-sans-modern), Inter, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

export type AppColorMode = 'light' | 'dark';

export function createAppTheme(mode: AppColorMode): Theme {
  if (mode === 'dark') {
    return createTheme({
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
          default: '#08080a',
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
      shape: commonShape,
      typography: commonTypography,
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: { backgroundColor: 'transparent' },
          },
        },
        MuiPaper: {
          defaultProps: { elevation: 0 },
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
  }

  return createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#404040',
        light: '#525252',
        dark: '#262626',
        contrastText: '#fafafa',
      },
      secondary: {
        main: '#737373',
        light: '#a3a3a3',
        dark: '#525252',
      },
      background: {
        default: '#dfe7fa',
        paper: '#95a8c4',
      },
      text: {
        primary: '#0a0a0a',
        secondary: '#404040',
        disabled: 'rgba(10,10,10,0.38)',
      },
      divider: 'rgba(0, 0, 0, 0.12)',
      error: { main: '#b91c1c' },
      warning: { main: '#a16207' },
      info: { main: '#525252' },
      success: { main: '#15803d' },
      action: {
        active: '#171717',
        hover: 'rgba(0, 0, 0, 0.06)',
        selected: 'rgba(0, 0, 0, 0.09)',
        disabledBackground: 'rgba(0, 0, 0, 0.06)',
      },
    },
    shape: commonShape,
    typography: commonTypography,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { backgroundColor: 'transparent' },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundImage: 'none !important',
            backgroundColor: '#f5f5f5',
            borderColor: 'rgba(0, 0, 0, 0.12)',
            borderRadius: '12px',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          containedPrimary: {
            backgroundImage: 'linear-gradient(180deg, #4a4a4a 0%, #353535 48%, #2a2a2a 100%)',
            color: '#fafafa',
            border: '1px solid rgba(0, 0, 0, 0.35)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.18)',
            '&:hover': {
              backgroundImage: 'linear-gradient(180deg, #555 0%, #404040 48%, #303030 100%)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.22)',
            },
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            '&::before': {
              borderBottomColor: 'rgba(64,64,64,0.45) !important',
            },
            '&::after': {
              borderBottomColor: '#262626',
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(0, 0, 0, 0.2)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(0, 0, 0, 0.32)',
            },
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            backgroundImage: 'none !important',
            backgroundColor: '#f5f5f5',
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundImage: 'none !important',
            backgroundColor: '#f5f5f5',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundImage: 'none !important',
            backgroundColor: '#f5f5f5',
            border: '1px solid rgba(0, 0, 0, 0.14)',
            boxShadow: '0 8px 28px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
  });
}
