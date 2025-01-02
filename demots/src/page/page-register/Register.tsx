import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuLaterale } from '../../components/msdrawer/Drawer';
import { UserI } from '../../general/Utils';
import PageLayout, { TypeMessage } from '../page-layout/PageLayout';
import RegisterContent from './RegisterContent';

export interface PointsI {
  _id: string | undefined;
  email: string;
  points: number;
  numeroPunti: number;
  attivita: string;
}

const Register: React.FC<{ user: UserI, setTitle:any }> = ({ user, setTitle}) => {

  setTitle("Section register");
  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  const menuLaterale : MenuLaterale[][]= [];
  const [open, setOpen] = useState(false); // Controlla la visibilità del messaggio
  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
  const padding = isVertical ? 5 : 8;
  const [message, setMessage] = React.useState<TypeMessage>({}); // Lo stato è un array di stringhe


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
        message={message}
        handleClose={handleClose}
        padding={padding}
      >
        <RegisterContent
          user={user}
          setMessage={setMessage}
          setOpen ={setOpen}
        />
      </PageLayout>
      <div>
        {/* Contenuto aggiuntivo, se necessario */}
      </div>
    </>
  );
};

export default Register;






