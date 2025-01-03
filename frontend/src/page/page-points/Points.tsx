import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMenuLaterale, UserI } from '../../general/Utils';
import PageLayout, { TypeMessage } from '../page-layout/PageLayout';
import PointsContent from './PointsContent';

export interface PointsI {
  _id: string | undefined;
  email: string;
  //points: number;
  point: number;
  numeroPunti: number;
  attivita: string;
  usePoints?: number;
}

const Points: React.FC<{ user: UserI, setTitle:any }> = ({ user, setTitle}) => {

  setTitle("Section Points");

  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  const menuLaterale = getMenuLaterale(navigate, user);
  const [open, setOpen] = useState(false); // Controlla la visibilità del messaggio
  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
  const [paddingType, setPaddingType] =  useState<number>(isVertical ? 0 : 5);
  const [message, setMessage] = React.useState<TypeMessage>({}); // Lo stato è un array di stringhe


  useEffect(() => {

    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
      setPaddingType(window.innerHeight > window.innerWidth ? 0 : 5);

    };

    window.addEventListener("resize", handleResize);

    // Pulisci il listener al dismount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <PageLayout
        menuLaterale={menuLaterale}
        open={open}
        message={message}
        handleClose={handleClose}
        padding={paddingType}
      >
        <PointsContent
          user={user}
          setMessage={setMessage}
          setOpen={setOpen}
        />
      </PageLayout>
      <div>
        {/* Contenuto aggiuntivo, se necessario */}
      </div>
    </>
  );
};

export default Points;





