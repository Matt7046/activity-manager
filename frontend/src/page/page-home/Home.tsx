import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuLaterale } from "../../components/ms-drawer/Drawer";
import PageLayout, { TypeMessage } from '../page-layout/PageLayout';
import HomeContent from './HomeContent';


const Home: React.FC<{}> = ({ }) => {

  const [title, setTitle] = useState<string>('');
  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  const menuLaterale: MenuLaterale[][] = [];
  const [open, setOpen] = useState(false); // Controlla la visibilità del messaggio
  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
  const [message, setMessage] = React.useState<TypeMessage>({}); // Lo stato è un array di stringhe

  useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize)
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  

  return (
    <>
      <PageLayout
        title={title}
        menuLaterale={menuLaterale}
        alertConfig={{ open, setOpen, message, setMessage }}       
        isVertical={isVertical}
        handleClose={handleClose}
        navigate={useNavigate()}>
        <HomeContent
        />
      </PageLayout>
    </>
  );
};

export default Home;






