"use client";
import { messages as deMessages } from '@/locales/de/messages';
import { messages as enMessages } from '@/locales/en/messages';
import { messages as esMessages } from '@/locales/es/messages';
import { messages as frMessages } from '@/locales/fr/messages';
import { messages as itMessages } from '@/locales/it/messages';
import { messages as ptMessages } from '@/locales/pt/messages';
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { useEffect, useState } from "react";

// Carichiamo i messaggi fuori dal componente per farlo una volta sola
i18n.load({
  it: itMessages,
  en: enMessages,
  fr: frMessages,
  de: deMessages,
  es: esMessages,
  pt: ptMessages,
});

export function LinguiClientProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Recupera la lingua dal localStorage o usa 'it' come default
    const savedLanguage = localStorage.getItem('lang') || 'it';
    i18n.activate(savedLanguage);
    setIsLoaded(true);
  }, []);

  // Evita il flickering durante l'attivazione della lingua
  if (!isLoaded) return null;

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
}