
import './App.css';
import SubPromise from "./components/pageSubPromise/SubPromise";
import About from './components/pageAbout/About';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, NavigateFunction } from 'react-router-dom'; // Importa i componenti necessari
import '@fortawesome/fontawesome-free/css/all.min.css';
import { MenuLaterale } from './components/ACDrawer/Drawer';

// App.tsx

export const navigateRouting = (navigate: NavigateFunction, path: string, params: any) => {
  navigate(`/${path}`, { state: params }); // Passa i parametri come stato
};
export const sezioniMenuIniziale: MenuLaterale[][] = [
  [
    { funzione: null, testo: 'Home' },
    { funzione: null, testo: 'About' },
    { funzione: null, testo: 'Send email' },
    { funzione: null, testo: 'Drafts' },
  ],
  [
    { funzione: null, testo: 'All mail' },
    { funzione: null, testo: 'Trash' },
    { funzione: null, testo: 'Spam' },
  ],
];

 export const showError = (setOpen:any, setError: any, errore?:string) => {
  errore = errore ? errore : 'Il server non risponde';
  setOpen(true);
  setError(errore)
  console.error(errore);


  }


export const sezioniMenu = (
  sezioni: MenuLaterale[][],
  navigate: NavigateFunction,
  path: string,
  params: any,
  indice: number
): MenuLaterale[][] => {
 

  // Calcola la posizione (riga e colonna) per assegnare la funzione
  const numeroRighe = sezioni.length;
  const lunghezzaRiga = sezioni[0].length;

  const riga = Math.floor(indice / lunghezzaRiga);
  const colonna = indice % lunghezzaRiga;

  // Verifica che riga e colonna siano validi e assegna la funzione dinamica
  if (riga < numeroRighe && colonna < sezioni[riga].length) {
    sezioni[riga][colonna].funzione = () => navigateRouting(navigate, path,params);
  }

  return sezioni;
};


const App = () => {
  return (
    <Router>
      <div>
        <h1>App1 con Routing</h1>
        <nav>
          <ul>
           
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<SubPromise/>} /> {/* Rende il componente Home alla route '/' */}
          <Route path="/about" element={<About/>} />
          </Routes>
      </div>
    </Router>
  );
}





export default App;

