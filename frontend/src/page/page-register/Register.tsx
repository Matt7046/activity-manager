import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../App';
import PageLayout, { TypeMessage } from '../page-layout/PageLayout';
import RegisterContent from './RegisterContent';

export interface PointsI {
  _id: string | undefined;
  email: string;
  points: number;
  numeroPunti: number;
  attivita: string;
}

const Register: React.FC<{ setTitle: (title: string) => void }> = ({ setTitle }) => {

  const location = useLocation();
  setTitle("Section register");
  const { user, setUser } = useUser();
  const [open, setOpen] = useState(false); // Controlla la visibilità del messaggio
  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
  const [paddingType, setPaddingType] = useState<number>(isVertical ? 0 : 5);
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
        open={open}
        message={message}
        user={user}
        isVertical={isVertical}
        handleClose={handleClose}
        navigate={useNavigate()}
      >
        <RegisterContent
          user={user}
          setMessage={setMessage}
          setOpen={setOpen}
          setTitle={setTitle}
          isVertical={isVertical}
        />
      </PageLayout>
    </>
  );
};

export default Register;






