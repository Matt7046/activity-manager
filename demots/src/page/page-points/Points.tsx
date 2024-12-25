import React, { useState } from 'react';
import PointsContent from './PointsContent';
import { UserI } from '../../general/Utils';

export interface PointsI {
  _id: string | undefined;
  email: string; 
  points: number;
  numeroPunti: number;
  attivita: string;
}

const Points: React.FC<{ user: UserI }> = ({ user }) => {

  const [utente, setUtente] = useState<UserI>(user); // Stato iniziale vuoto
  return (
    <>
      <PointsContent
        user={utente}
      />
    </>
  );
};

export default Points;






