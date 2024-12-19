
import './App.css';
import { Route, Routes, NavigateFunction, useLocation } from 'react-router-dom'; // Importa i componenti necessari
import '@fortawesome/fontawesome-free/css/all.min.css';
import { MenuLaterale } from './components/msdrawer/Drawer';
import Activity from './page/page-activity/Activity';
import About from './page/page-about/About';
import { useEffect, useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
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

export const showError = (setOpen: any, setError: any, errore?: string) => {
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
    sezioni[riga][colonna].funzione = () => navigateRouting(navigate, path, params);
  }

  return sezioni;
};



const App = () => {
  const [user, setUser] = useState(null);

  // Funzione per simulare la login di Google con risposta ammessa
  const simulateLogin = () => {
    const fakeResponse = {
      credential: "fake-token-id",  // Token fittizio per simulare il login
      clientId: "YOUR_GOOGLE_CLIENT_ID",
      select_by: "google", // Simula la selezione di Google
    };

    // Simula la risposta del login
    handleLoginSuccess(fakeResponse);
  };

  const handleLoginSuccess = (response: any) => {
    console.log("Simulated Login Success:", response);
    // Imposta l'utente come se il login fosse riuscito
    setUser({
      name: "Simulated User",  // Puoi simulare anche i dettagli dell'utente
      email: "user@simulated.com",
      token: response.credential,  // Usa il token fittizio
    } as any);
  };

  const handleLoginFailure = () => {
    console.log("Login Failed:");
  };
  const [title, setTitle] = useState('');  // Usa useState per gestire il titolo dinamico


  const location = useLocation(); // Ottieni la posizione corrente
  useEffect(() => {
    // Cambia il titolo della pagina in base alla route
    if (location.pathname === "/") {
      setTitle("Home - Activity");  // Titolo per la home page
    } else if (location.pathname === "/about") {
      setTitle("About");  // Titolo per la pagina "About"
    }
    document.title = title
  }, [location]);  // Il titolo si aggiorna ogni volta che cambia la route



  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
    <div>
      <h1>Login con Google (Simulato)</h1>

      {/* Se non c'è un utente loggato, mostra il pulsante di login */}
      {!user ? (
        <div>
          {/* Pulsante per simulare il login */}
          <button onClick={simulateLogin}>Simula Login con Google</button>

          {/* Effettivo pulsante di login di Google */}
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginFailure} // La funzione onError ora non ha parametri
          />
        </div>
      ) : (
        <div>
           <div>
            <h1>{title}</h1>
            <Routes>
              <Route path="/" element={<Activity />} /> {/* Rende il componente Activity alla route '/' */}
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
  
        </div>
      )}
    </div>
  </GoogleOAuthProvider>
);
 
};

export default App;



