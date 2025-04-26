import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../App';
import { getMenuLaterale, ResponseI } from '../../general/structure/Utils';
import { showMessage } from '../page-home/HomeContent';
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

const Activity: React.FC<{  }> = ({ }) => {


  const [title, setTitle] = useState<string>("Sezione attività");
  const { user, setUser } = useUser();
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
    return () => { };
  }, [activitySchedule]);

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



  const getActivities = () => {
    if (!hasFetchedData) {
      hasFetchedData = true
      // Effettua la chiamata GET quando il componente è montato 
      // axios.
      //  .get('https://api.example.com/data') // URL dell'API]
      const emailFind = user.emailChild;
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
        title={title}
        menuLaterale={menuLaterale}
        alertConfig={{open,setOpen,message,setMessage}}
        isVertical={isVertical}
        handleClose={handleClose}
        navigate={useNavigate()}

      >
        <ActivityContent
          responseSchedule={response}
          user={user}
          alertConfig={{open,setOpen,message,setMessage}}
          isVertical={isVertical}
        />
      </PageLayout>
    </>
  );
}
export default Activity;
