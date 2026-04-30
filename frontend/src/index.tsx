import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Importa BrowserRouter
import App from './App';
import { messages as deMessages } from './locales/de/messages';
import { messages as enMessages } from './locales/en/messages';
import { messages as esMessages } from './locales/es/messages';
import { messages as frMessages } from './locales/fr/messages';
import { messages as itMessages } from './locales/it/messages';
import { messages as ptMessages } from './locales/pt/messages';

// --- INIZIALIZZA LINGUI ---

// 1. Carica il catalogo italiano (Sorgente)
i18n.load('it', itMessages);

// 2. Carica il catalogo inglese
i18n.load('en', enMessages);

// 3. Carica il catalogo francese
i18n.load('fr', frMessages);

// 4. Carica il catalogo tedesco
i18n.load('de', deMessages);

// 5. Carica il catalogo spagnolo
i18n.load('es', esMessages);

// 6. Carica il catalogo portoghese
i18n.load('pt', ptMessages);

// 3. Attiva la lingua iniziale (magari leggendo dal localStorage o dal browser)
const savedLanguage = localStorage.getItem('lang') || 'it';
i18n.activate(savedLanguage);
const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootElement);



export interface GoogleAuthComponentProps {
  newLogin?: boolean; // Definisci un tipo per il prop
}
root.render(
  // Adesso 'i18n' esiste perché lo abbiamo importato e inizializzato sopra
  <I18nProvider i18n={i18n}>
  <BrowserRouter> {/* Avvolgi l'intera applicazione con BrowserRouter */}
    <App />
  </BrowserRouter>
  </I18nProvider>
);

