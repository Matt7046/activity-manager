import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showMessage, useUser } from '../../App';
import { TypeAlertColor } from '../../general/structure/Constant';
import { FamilyNotificationI, getMenuLaterale, ResponseI, UserI } from '../../general/structure/Utils';
import PageLayout, { TypeMessage } from '../page-layout/PageLayout';
import ActivityContent from './ActivityContent';
import { fetchDataActivities } from './service/ActivityService';
import activityStore from './store/ActivityStore';

export interface ActivityI {
  _id: string | undefined;
  nome: string;
  subTesto: string;
  points?: number;
}

export interface ActivityLogI {
  _id?: string;
  email: string;
  log: string;
  date: Date;
  usePoints: number;

}

const Activity: React.FC<{ setTitle: any }> = ({ setTitle }) => {


  //setTitle("Sezione attività");
  const { user, setUser } = useUser();
  const [utente, setUtente] = useState<UserI>(user); // Stato iniziale vuoto
  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  const menuLaterale = getMenuLaterale(navigate, user)
  const [response, setResponse] = useState<any>([]); // Stato iniziale vuoto
  const [message, setMessage] = React.useState<TypeMessage>({}); // Lo stato è un array di stringhe
  const [open, setOpen] = useState(false); // Controlla la visibilità del messaggio
  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
  const [paddingType, setPaddingType] = useState<number>(isVertical ? 0 : 5);
  const [activitySchedule, setActivitySchedule] = useState<boolean>(true);

  // default class Activity extends React.Component {

  let hasFetchedData = false;


  useEffect(() => {
    getActivities(); 
    return () =>{};
  }, [activitySchedule]); 

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



  const getActivities = () => {
    if (!hasFetchedData) {
      hasFetchedData = true;
      // Effettua la chiamata GET quando il componente è montato 
      // axios.
      //  .get('https://api.example.com/data') // URL dell'API]
      const emailFind = user.emailFamily ? user.emailFamily : user.email;
      fetchDataActivities({ ...user, email: emailFind }, (message: any) => showMessage(setOpen, setMessage, message))
        .then((response) => {
          if (response) {
            setResponse(response.jsonText)
            caricamentoIniziale(response);
          }
        })
        .catch((error) => {
          console.error('Errore durante il recupero dei dati:', error);
        });
    }
  }

  const handleClose = () => {
    setOpen(false);
  };

  const caricamentoIniziale = (response: ResponseI): void => {
    return setAllTesto(response);
  }

  const setAllTesto = (response: ResponseI): void => {
    activityStore.setAllActivity(response);
  }

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
        <ActivityContent
          responseSchedule={response}
          user={utente}
          setOpen={setOpen}
          setMessage={setMessage}
          isVertical ={isVertical}
        />
      </PageLayout>    
    </>
  );
}
export default Activity;
