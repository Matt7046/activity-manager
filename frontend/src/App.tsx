import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { createContext, useContext, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Presentation from './components/ms-presentation/Presentation';
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
// Provider del contesto
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  // Funzione per distruggere l'utente
  const resetUser = () => setUser(null);  

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
  const { user, setUser } = useUser();
  const location = useLocation();

  const userLabel = user ? user.name : "Non autenticato"
  const label = 'Login ' + userLabel;
  if (location.pathname === '/') {
    return (
      <Presentation> </Presentation>
    );
  }
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/register" element={<Register />} />
      <Route path="/activity" element={<Activity />} />
      <Route path="/about" element={<About />} />
      <Route path="/points" element={<Points />} />
      <Route path="/operative" element={<Operative />} />
      <Route path="/family" element={<Family />} />
    </Routes>);
};


export default App;
