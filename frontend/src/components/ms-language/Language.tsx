"use client";
import { i18n } from "@lingui/core";
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { baseStore } from '../../general/structure/BaseStore';
import "./Language.css";

interface LanguageProps { }

const Language: React.FC<LanguageProps> = () => {
  const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);
  // Questo stato locale serve solo a forzare il re-render dell'icona nel componente stesso
  const [currentLang, setCurrentLang] = useState(i18n.locale);

  const handleOpenLang = (event: React.MouseEvent<HTMLButtonElement>) => {
    setLangAnchor(event.currentTarget);
  };

  const handleSelectLang = (lang: string) => {
    i18n.activate(lang);
    baseStore.setLang(lang);
    setCurrentLang(lang); // Forza l'aggiornamento dell'icona
    setLangAnchor(null);
  };

  const flags: Record<string, string> = {
    it: '🇮🇹',
    en: '🇺🇸',
    fr: '🇫🇷',
    de: '🇩🇪',
    es: '🇪🇸',
    pt: '🇵🇹'
  };

  return (
    <>
      {/* Contenitore per allineare i pulsanti in alto a destra */}
      <Box display="flex" justifyContent="flex-end" px={2} mt={1}>
        <IconButton onClick={handleOpenLang} color="primary">
          <span style={{ fontSize: '20px' }}>
            {/* Mostriamo la bandiera della lingua ATTUALE */}
            {flags[i18n.locale as keyof typeof flags] || '🌐'}
          </span>
        </IconButton>

        <Menu
          anchorEl={langAnchor}
          open={Boolean(langAnchor)}
          onClose={() => setLangAnchor(null)}
        >
          <MenuItem onClick={() => handleSelectLang('it')}>🇮🇹 Italiano</MenuItem>
          <MenuItem onClick={() => handleSelectLang('en')}>🇺🇸 English</MenuItem>
          <MenuItem onClick={() => handleSelectLang('fr')}>🇫🇷 Français</MenuItem>
          <MenuItem onClick={() => handleSelectLang('de')}>🇩🇪 Deutsch</MenuItem>
          <MenuItem onClick={() => handleSelectLang('es')}>🇪🇸 Español</MenuItem>
          <MenuItem onClick={() => handleSelectLang('pt')}>🇵🇹 Português</MenuItem>
        </Menu>
      </Box>
    </>
  );
}

export default Language;
