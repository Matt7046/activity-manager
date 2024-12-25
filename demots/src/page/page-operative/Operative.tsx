import React, { useState } from 'react';
import OperativeContent from './OperativeContent';
import { UserI } from '../../general/Utils';


const Operative: React.FC<{ user: UserI }> = ({ user }) => {

  const [utente, setUtente] = useState<UserI>(user); // Stato iniziale vuoto


  return (
    <>
      <OperativeContent user={utente} />
    </>
  );
};

export default Operative;






