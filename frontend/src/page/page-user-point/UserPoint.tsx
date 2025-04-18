import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showMessage, useUser } from '../../App';
import { TypeAlertColor, TypeUser } from '../../general/structure/Constant';
import { FamilyNotificationI, getMenuLaterale } from '../../general/structure/Utils';
import PageLayout, { TypeMessage } from '../page-layout/PageLayout';
import PointsContent from './UserPointContent';

export interface UserPointsI {
  _id: string | undefined;
  email?: string;
  //points: number;
  point?: number;
  numeroPunti?: number;
  attivita?: string;
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

    const socket = new WebSocket("ws://localhost/ws/notifications?emailUserCurrent=" + user.emailUserCurrent);
    socket.onopen = () => {
    };
    socket.onmessage = (event) => {
      setOpen(true);

      const familyNotification: FamilyNotificationI = JSON.parse(event.data);
      const typeMessage: TypeMessage = {
        message: [familyNotification.message],
        typeMessage: TypeAlertColor.INFO
      }
      showMessage(setOpen, setMessage, typeMessage);
    };

    socket.onclose = () => {
    };

    return () => {
      window.removeEventListener("resize", handleResize)
      socket.close();
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
        open={open}
        message={message}
        user={user}
        isVertical={isVertical}
        handleClose={handleClose}
        navigate={useNavigate()}
      >
        <PointsContent
          user={user}
          setMessage={setMessage}
          setOpen={setOpen}
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






