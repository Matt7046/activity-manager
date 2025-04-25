import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../App';
import PageLayout, { TypeMessage } from '../page-layout/PageLayout';
import RegisterContent from './RegisterContent';


const Register: React.FC<{}> = ({ }) => {

  const location = useLocation();
  const [title, setTitle] = useState<string>("Sezione registrazione");
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
        title={title}
        alertConfig={{open,setOpen,message,setMessage}}
        isVertical={isVertical}
        handleClose={handleClose}
        navigate={useNavigate()}
        hiddenEmail={true}
      >
        <RegisterContent
          user={user}
          alertConfig={{open,setOpen,message,setMessage}}
          setTitle={setTitle}
          isVertical={isVertical}
        />
      </PageLayout>
    </>
  );
};

export default Register;






