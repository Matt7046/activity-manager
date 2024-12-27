import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMenuLaterale, UserI } from '../../general/Utils';
import PageLayout from '../page-layout/PageLayout';
import PointsContent from './PointsContent';

export interface PointsI {
  _id: string | undefined;
  email: string;
  points: number;
  numeroPunti: number;
  attivita: string;
  usePoints?: number;
}

const Points: React.FC<{ user: UserI }> = ({ user }) => {

  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  const menuLaterale = getMenuLaterale(navigate, user);
  const [open, setOpen] = useState(false); // Controlla la visibilità del messaggio
  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
  const padding = isVertical ? 5 : 8;
  const [errors, setErrors] = React.useState<string[]>([]); // Lo stato è un array di stringhe


  useEffect(() => {

    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
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
        errors={errors}
        handleClose={handleClose}
        padding={padding}
      >
        <PointsContent
          user={user}
          setErrors={setErrors}
        />
      </PageLayout>
      <div>
        {/* Contenuto aggiuntivo, se necessario */}
      </div>
    </>
  );
};

export default Points;






