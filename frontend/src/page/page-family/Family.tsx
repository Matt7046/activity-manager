import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../App';
import { getMenuLaterale } from '../../general/structure/Utils';
import PageLayout, { TypeMessage } from '../page-layout/PageLayout';
import FamilyContent from './FamilyContent';



export interface FamilyLogI {
  _id?: string;
  performedByEmail: string;
  receivedByEmail: string;
  date: Date;
  operations: string;

}

const Family: React.FC<{}> = ({ }) => {



  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  const { user, setUser } = useUser();
  const menuLaterale = getMenuLaterale(navigate, user);
  const [open, setOpen] = useState(false); // Controlla la visibilità del messaggio
  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
  const [paddingType, setPaddingType] = useState<number>(isVertical ? 0 : 5);
  const [message, setMessage] = React.useState<TypeMessage>({}); // Lo stato è un array di stringhe  
  const [title, setTitle] = useState<string>("Sezione famiglia");


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
        menuLaterale={menuLaterale}
        alertConfig={{open,setOpen,message,setMessage}}
        user={user}
        isVertical={isVertical}
        handleClose={handleClose}
        navigate={useNavigate()}
      >
        <FamilyContent
          alertConfig={{open,setOpen,message,setMessage}}
          isVertical={isVertical}
        />
      </PageLayout>
    </>
  );
};

export default Family;






