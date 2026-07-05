"use client";

import React from "react";
import { useLingui } from "@lingui/react";
import { Moon, Sun } from "lucide-react";
import { useThemeMode } from "@/context/ThemeModeContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ThemeTogglePlacement = "default" | "header";

interface ThemeToggleProps {
  /** `header`: toolbar presentation / affianco lingua, padding ridotto. */
  placement?: ThemeTogglePlacement;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ placement = "default" }) => {
  const { mode, toggle } = useThemeMode();
  const { i18n } = useLingui();
  const isDark = mode === "dark";
  const label = isDark ? i18n._("theme_switch_to_light") : i18n._("theme_switch_to_dark");

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn(
        "text-[var(--color-primary)]",
        placement === "header" && "m-0"
      )}
    >
      {isDark ? <Sun className="size-[1.35rem]" /> : <Moon className="size-[1.35rem]" />}
    </Button>
  );
};

export default ThemeToggle;
