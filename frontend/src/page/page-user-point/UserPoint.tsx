import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showMessage, useUser } from '../../App';
import { TypeAlertColor, TypeUser } from '../../general/Constant';
import { FamilyNotificationI, getMenuLaterale } from '../../general/Utils';
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
}

const Points: React.FC<{ setTitle: any }> = ({ setTitle }) => {

  const { user, setUser } = useUser();
  const title = user.type === TypeUser.FAMILY ? ' (tutorato)' : ''
  setTitle("Sezione informazioni utente" + title);

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
      console.log("Connected to WebSocket");
    };
    socket.onmessage = (event) => {
      setOpen(true);

      const familyNotification: FamilyNotificationI = JSON.parse(event.data);
      console.log("notificationFamily" + familyNotification);
      const typeMessage: TypeMessage = {
        message: [familyNotification.message],
        typeMessage: TypeAlertColor.INFO
      }
      showMessage(setOpen, setMessage, typeMessage);
    };

    socket.onclose = () => {
      console.log("Disconnected from WebSocket");
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






