'use client';

import { STORAGE_KEY } from '@/general/structure/Constant';
import type { AppColorMode } from '@/theme/createAppTheme';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';



export const readStoredMode = (): AppColorMode | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'light' || raw === 'dark') return raw;
  } catch {
    /* quota / private mode */
  }
  return null;
}

type ThemeModeContextValue = {
  mode: AppColorMode;
  toggle: () => void;
  setMode: (m: AppColorMode) => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export const ThemeModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<AppColorMode>('dark');
  /** Evita localStorage.setItem prima di aver letto il valore salvato (sovra-non scrittura sul default). */
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);

  useEffect(() => {
    const stored = readStoredMode();
    if (stored !== null) setMode(stored);
    setPreferencesLoaded(true);
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || e.newValue == null) return;
      if (e.newValue === 'light' || e.newValue === 'dark') {
        setMode(e.newValue as AppColorMode);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = mode;
    root.style.colorScheme = mode;
  }, [mode]);

  useEffect(() => {
    if (!preferencesLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
  }, [mode, preferencesLoaded]);

  const toggle = useCallback(() => {
    setMode((m) => (m === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo(
    () => ({
      mode,
      toggle,
      setMode,
    }),
    [mode, toggle],
  );

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}

export const useThemeMode = (): ThemeModeContextValue => {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) {
    throw new Error('useThemeMode must be used within ThemeModeProvider');
  }
  return ctx;
}
