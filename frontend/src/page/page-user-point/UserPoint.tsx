import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../App';
import { TypeUser } from '../../general/structure/Constant';
import { getMenuLaterale } from '../../general/structure/Utils';
import PageLayout, { TypeMessage } from '../page-layout/PageLayout';
import PointsContent from './UserPointContent';

export interface UserPointsI {
  _id: string | undefined;
  email?: string;
  password?:string;
  numeroPunti?: number;
  usePoints?: number;
  nameImage?: string;
}


export interface ImageI {

  file: FormData;
  width: number;
  height: number;

}


export interface NameImageI {

  name: string;
}

const Points: React.FC<{}> = ({ }) => {

  const { user, setUser } = useUser();
  const subTitle = user.type === TypeUser.FAMILY ? ' (tutorato)' : ''
  const [title, setTitle] = useState<string>("Sezione informazioni utente"+subTitle);
  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  const menuLaterale = getMenuLaterale(navigate, user);
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
        alertConfig={{open,setOpen,message,setMessage}}
        isVertical={isVertical}
        handleClose={handleClose}
        navigate={useNavigate()}
      >
        <PointsContent
          user={user}
          alertConfig={{open,setOpen,message,setMessage}}
          isVertical={isVertical}
        />
      </PageLayout>
      <div>
        {/* Contenuto aggiuntivo, se necessario */}
      </div>
    </>
  );
};

export default Points;






