import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Importa BrowserRouter
import App from './App';

const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootElement);



export interface GoogleAuthComponentProps {
  newLogin?: boolean; // Definisci un tipo per il prop
}
root.render(
  <BrowserRouter> {/* Avvolgi l'intera applicazione con BrowserRouter */}
    <App />
  </BrowserRouter>
);

