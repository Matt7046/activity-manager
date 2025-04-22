import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import About from './page/page-about/About';
import Activity from './page/page-activity/Activity';
import Family from './page/page-family/Family';
import Home from './page/page-home/Home';
import Operative from './page/page-operative/Operative';
import PrivacyPolicy from './page/page-privacy-policy/PrivacyPolicy';
import Register from './page/page-register/Register';
import Points from './page/page-user-point/UserPoint';


// Creazione del contesto per User
const UserContext = createContext<any>(null);

// Hook per accedere al contesto
export const useUser = () => useContext(UserContext);

// Componente UserProvider che gestisce lo stato di `user`
interface UserProviderProps {
  children: ReactNode; // Aggiungi la prop `children` di tipo ReactNode
}

// Provider del contesto
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null); // Stato utente
  const location = useLocation(); // Per monitorare la posizione corrente

  // Funzione per distruggere l'utente
  const resetUser = () => setUser(null);

  useEffect(() => {
    // Se la posizione è la pagina di login, distruggi il contesto
    if (location.pathname === '/') {
      resetUser();
    }


    return () => {
    };
  }, [location]);

  return (
    <UserContext.Provider value={{ user, setUser, resetUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Componente principale, avvolto da GoogleOAuthProvider
const App = () => (
  <UserProvider>
    <AppComponent />
  </UserProvider>);

// Componente di autenticazione
const AppComponent = () => {
  const navigate = useNavigate();  // Qui chiami useNavigate correttamente all'interno di un componente


  const { user, setUser } = useUser();
  const location = useLocation();
  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);





  useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    // Pulisci il listener al dismount
    return () => window.removeEventListener("resize", handleResize);
  }, []);





  const userLabel = user ? user.name : "Non autenticato"
  const label = 'Login ' + userLabel;
  if (location.pathname === '/') {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Benvenuto in Activity Manager</h1>
        <p>Gestisci attività, punti e molto altro in famiglia!</p>
        <button 
          onClick={() => navigate('/home')}
          style={{ 
            padding: '0.5rem 1.5rem', 
            fontSize: '1rem', 
            cursor: 'pointer', 
            backgroundColor: '#007BFF', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '5px', 
            marginTop: '1rem' 
          }}
        >
          Entra
        </button>
      </div>
    );
  }

  return (
    <>

      <div>
        <div>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/register" element={<Register />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/about" element={<About />} />
            <Route path="/points" element={<Points />} />
            <Route path="/operative" element={<Operative />} />
            <Route path="/family" element={<Family />} />
          </Routes>
        </div>
      </div>

    </>
  );
};


export default App;
