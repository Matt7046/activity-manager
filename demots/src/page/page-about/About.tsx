import React, { useEffect } from 'react';
import AboutContent from './AboutContent';


const About: React.FC = () => {
  
 
  return (
    <>
      <AboutContent
        key={0} // Chiave univoca (modifica se necessario per un array di elementi)
        rowIndex={0} // Passa la riga corrente o aggiorna dinamicamente
      />
    </>
  );
};

export default About;






