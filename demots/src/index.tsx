import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';  // Importa BrowserRouter
import App from './App';  // Assicurati che App sia il tuo componente principale

const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <BrowserRouter> {/* Avvolgi l'intera applicazione con BrowserRouter */}
    <App />
  </BrowserRouter>
);

