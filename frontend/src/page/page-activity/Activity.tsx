import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showMessage, useUser } from '../../App';
import { TypeAlertColor, TypeUser } from '../../general/Constant';
import { FamilyNotificationI, getMenuLaterale, ResponseI, UserI } from '../../general/Utils';
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


  setTitle("Section Activity");
  const { user, setUser } = useUser();
  const [utente, setUtente] = useState<UserI>(user); // Stato iniziale vuoto
  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  const menuLaterale = getMenuLaterale(navigate, user)
  const [response, setResponse] = useState<any>([]); // Stato iniziale vuoto
  const [message, setMessage] = React.useState<TypeMessage>({}); // Lo stato è un array di stringhe
  const [open, setOpen] = useState(false); // Controlla la visibilità del messaggio
  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
  const [paddingType, setPaddingType] = useState<number>(isVertical ? 0 : 5);


  // default class Activity extends React.Component {

  let hasFetchedData = false;


  useEffect(() => {
    // Questo codice verrà eseguito dopo che il componente è stato montato
    componentDidMount();
    //window.addEventListener('resize', handleResize);

    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
      setPaddingType(window.innerHeight > window.innerWidth ? 0 : 5);
    };

    window.addEventListener("resize", handleResize);

    // Pulisci il listener al dismount
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Il secondo argomento vuoto ind ica che l'effetto dipenderà solo dal mount

  useEffect(() => {
      const socket = new WebSocket("ws://localhost:8088/ws/notifications");
      socket.onopen = () => {
        console.log("Connected to WebSocket");
      };
      socket.onmessage = (event) => {
        setOpen(true);  
  
        const familyNotification: FamilyNotificationI = JSON.parse(event.data);
        console.log("notificationFamily"+familyNotification);
      
        if ( user.type === TypeUser.STANDARD && utente.emailFamily === familyNotification.emailFamily) {
          const typeMessage: TypeMessage = {
            message: [familyNotification.pointsNew],
            typeMessage: TypeAlertColor.INFO
          }
          showMessage(setOpen, setMessage, typeMessage);       
        }
      };
  
      socket.onclose = () => {
        console.log("Disconnected from WebSocket");
      };
  
      return () => {
        socket.close();
      };
    }, []);
  

  const componentDidMount = () => {
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
        handleClose={handleClose}
        navigate={useNavigate()}
      >
        <ActivityContent
          responseSchedule={response}
          user={utente}
          setOpen={setOpen}
          setMessage={setMessage}
        />
      </PageLayout>
      <div>
        {/* Contenuto aggiuntivo, se necessario */}
      </div>
    </>
  );
}
export default Activity;
