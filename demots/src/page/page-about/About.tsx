import React, { useEffect, useState } from 'react';
import AboutContent from './AboutContent';

const About: React.FC<{ user: any }> = ({ user }) => {

  const [utente, setUtente] = useState<any>(user); // Stato iniziale vuoto


  return (
    <>
      <AboutContent user={utente} />
    </>
  );
};

export default About;






