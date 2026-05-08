"use client";
import { i18n } from "@lingui/core";
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { baseStore } from '../../general/structure/BaseStore';
import "./Language.css";

interface LanguageProps { }

const Language: React.FC<LanguageProps> = () => {
  const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);
  // Stato locale usato per forzare il re-render del pulsante lingua.
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

  const languages: Record<string, { label: string; flagUrl: string }> = {
    it: { label: 'Italiano', flagUrl: 'https://flagcdn.com/it.svg' },
    en: { label: 'English', flagUrl: 'https://flagcdn.com/us.svg' },
    fr: { label: 'Français', flagUrl: 'https://flagcdn.com/fr.svg' },
    de: { label: 'Deutsch', flagUrl: 'https://flagcdn.com/de.svg' },
    es: { label: 'Español', flagUrl: 'https://flagcdn.com/es.svg' },
    pt: { label: 'Português', flagUrl: 'https://flagcdn.com/pt.svg' }
  };

  const normalizedLocale = (currentLang || i18n.locale || "it").toLowerCase().split("-")[0];
  const currentLanguage = languages[normalizedLocale as keyof typeof languages] || languages.it;

  return (
    <>
      {/* Contenitore per allineare i pulsanti in alto a destra */}
      <Box display="flex" justifyContent="flex-end" px={2} mt={1}>
        <IconButton onClick={handleOpenLang} color="primary">
          <img
            src={currentLanguage.flagUrl}
            alt={`Lingua ${normalizedLocale}`}
            className="language-flag-svg"
          />
        </IconButton>

        <Menu
          anchorEl={langAnchor}
          open={Boolean(langAnchor)}
          onClose={() => setLangAnchor(null)}
        >
          <MenuItem onClick={() => handleSelectLang('it')}>
            <img src={languages.it.flagUrl} alt="Italiano" className="language-flag-svg-menu" />
            {languages.it.label}
          </MenuItem>
          <MenuItem onClick={() => handleSelectLang('en')}>
            <img src={languages.en.flagUrl} alt="English" className="language-flag-svg-menu" />
            {languages.en.label}
          </MenuItem>
          <MenuItem onClick={() => handleSelectLang('fr')}>
            <img src={languages.fr.flagUrl} alt="Français" className="language-flag-svg-menu" />
            {languages.fr.label}
          </MenuItem>
          <MenuItem onClick={() => handleSelectLang('de')}>
            <img src={languages.de.flagUrl} alt="Deutsch" className="language-flag-svg-menu" />
            {languages.de.label}
          </MenuItem>
          <MenuItem onClick={() => handleSelectLang('es')}>
            <img src={languages.es.flagUrl} alt="Español" className="language-flag-svg-menu" />
            {languages.es.label}
          </MenuItem>
          <MenuItem onClick={() => handleSelectLang('pt')}>
            <img src={languages.pt.flagUrl} alt="Português" className="language-flag-svg-menu" />
            {languages.pt.label}
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
}

export default Language;
