'use client';

import { ThemeModeProvider, useThemeMode } from '@/context/ThemeModeContext';
import { createAppTheme } from '@/theme/createAppTheme';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import React, { useMemo } from 'react';

const DynamicMuiInner = ({ children }: { children: React.ReactNode }) => {
  const { mode } = useThemeMode();
  const theme = useMemo(() => createAppTheme(mode), [mode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
}

export function MuiThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeModeProvider>
      <DynamicMuiInner>{children}</DynamicMuiInner>
    </ThemeModeProvider>
  );
}
