'use client';

import React from 'react';
import { useLingui } from '@lingui/react';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import IconButton from '@mui/material/IconButton';
import { useThemeMode } from '@/context/ThemeModeContext';
import './ThemeToggle.css';

export type ThemeTogglePlacement = 'default' | 'header';

interface ThemeToggleProps {
  /** `header`: toolbar presentation / affianco lingua, padding ridotto. */
  placement?: ThemeTogglePlacement;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ placement = 'default' }) => {
  const { mode, toggle } = useThemeMode();
  const { i18n } = useLingui();
  const isDark = mode === 'dark';
  const label = isDark ? i18n._('theme_switch_to_light') : i18n._('theme_switch_to_dark');

  return (
    <IconButton
      onClick={toggle}
      color="primary"
      aria-label={label}
      title={label}
      className={`theme-toggle-root${placement === 'header' ? ' theme-toggle-root--header' : ''}`}
    >
      {isDark ? <LightModeOutlinedIcon className="theme-toggle-icon" /> : <DarkModeOutlinedIcon className="theme-toggle-icon" />}
    </IconButton>
  );
};

export default ThemeToggle;
