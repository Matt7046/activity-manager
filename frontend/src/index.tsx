import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Importa BrowserRouter
import App from './App';
import { messages as enMessages } from './locales/en/messages';
import { messages as itMessages } from './locales/it/messages';

// --- INIZIALIZZA LINGUI ---

// 1. Carica il catalogo italiano
i18n.load('it', itMessages);

// 2. Carica il catalogo inglese
i18n.load('en', enMessages);

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

