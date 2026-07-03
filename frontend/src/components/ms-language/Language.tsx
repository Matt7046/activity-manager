"use client";
import { i18n } from "@lingui/core";
import { useState } from "react";
import { baseStore } from "../../general/structure/BaseStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type LanguagePlacement = "default" | "header";

interface LanguageProps {
  /** `header`: stessa riga toolbar (presentation), senza margin-top extra sul contenitore. */
  placement?: LanguagePlacement;
}

const Language: React.FC<LanguageProps> = ({ placement = "default" }) => {
  const [currentLang, setCurrentLang] = useState(i18n.locale);

  const handleSelectLang = (lang: string) => {
    i18n.activate(lang);
    baseStore.setLang(lang);
    setCurrentLang(lang);
  };

  const languages: Record<string, { label: string; flagUrl: string }> = {
    it: { label: "Italiano", flagUrl: "https://flagcdn.com/it.svg" },
    en: { label: "English", flagUrl: "https://flagcdn.com/us.svg" },
    fr: { label: "Français", flagUrl: "https://flagcdn.com/fr.svg" },
    de: { label: "Deutsch", flagUrl: "https://flagcdn.com/de.svg" },
    es: { label: "Español", flagUrl: "https://flagcdn.com/es.svg" },
    pt: { label: "Português", flagUrl: "https://flagcdn.com/pt.svg" },
  };

  const normalizedLocale = (currentLang || i18n.locale || "it").toLowerCase().split("-")[0];
  const currentLanguage = languages[normalizedLocale as keyof typeof languages] || languages.it;

  return (
    <div
      className={cn(
        "flex justify-end",
        placement === "header"
          ? "language-toolbar-header inline-flex items-center justify-center px-0"
          : "mt-1 px-2"
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="text-[var(--color-primary)]"
            />
          }
        >
          <img
            src={currentLanguage.flagUrl}
            alt={`Lingua ${normalizedLocale}`}
            className="block size-6 rounded-full object-cover"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {Object.entries(languages).map(([lang, { label, flagUrl }]) => (
            <DropdownMenuItem key={lang} onClick={() => handleSelectLang(lang)}>
              <img
                src={flagUrl}
                alt={label}
                className="mr-2 inline-block size-[18px] rounded-full object-cover align-middle"
              />
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Language;
