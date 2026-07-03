"use client";

import { ThemeModeProvider } from "@/context/ThemeModeContext";

const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <ThemeModeProvider>{children}</ThemeModeProvider>;
};

export default AppThemeProvider;
