import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Importa BrowserRouter
import App from './App';
import messages from "./locales/it/messages.json";
// --- INIZIALIZZA LINGUI ---
i18n.load('it', messages);
i18n.activate('it');
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

