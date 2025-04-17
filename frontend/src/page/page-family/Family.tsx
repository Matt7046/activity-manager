import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showMessage, useUser } from '../../App';
import { TypeAlertColor } from '../../general/structure/Constant';
import { FamilyNotificationI, getMenuLaterale } from '../../general/structure/Utils';
import PageLayout, { TypeMessage } from '../page-layout/PageLayout';
import FamilyContent from './FamilyContent';



export interface FamilyLogI {
  _id?: string;
  performedByEmail: string;
  receivedByEmail: string;
  date: Date;
  operations: string;

}

const Family: React.FC<{ setTitle: any }> = ({ setTitle }) => {

  setTitle("Sezione famiglia");

  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  const { user, setUser } = useUser();
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

    // Pulisci il listener al dismount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
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
        user={user}
        message={message}
        isVertical={isVertical}
        handleClose={handleClose}
        navigate={useNavigate()}
      >
        <FamilyContent
          setMessage={setMessage}
          setOpen={setOpen}
          isVertical={isVertical}
        />
      </PageLayout> 
    </>
  );
};

export default Family;






