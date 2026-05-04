"use client";

import React, { createContext, useContext, useState } from 'react';

// Creazione del contesto per User
const UserContext = createContext<any>(null);

// Hook per accedere al contesto
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser deve essere usato all\'interno di un UserProvider');
  }
  return context;
};

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