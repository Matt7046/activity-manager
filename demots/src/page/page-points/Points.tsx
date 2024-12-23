import React, { useState } from 'react';
import PointsContent from './PointsContent';


const Points: React.FC<{ user: any }> = ({ user }) => {

  const [utente, setUtente] = useState<any>(user); // Stato iniziale vuoto


  return (
    <>
      <PointsContent
        user={utente}
      />
    </>
  );
};

export default Points;






