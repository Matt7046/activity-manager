import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { navigateRouting, showMessage } from "../../App";
import { Pulsante } from "../../components/msbutton/Button";
import Schedule, { MsSchedule } from "../../components/msschedule/Schedule";
import { HttpStatus, UserI } from "../../general/Utils";
import { TypeMessage } from "../page-layout/PageLayout";
import "./ActivityContent.css";
import { fetchDataActivityById } from "./service/ActivityService";
import activityStore from "./store/ActivityStore"; // Importa lo store


interface ActivityContentProps {
  user: UserI;
  responseSchedule: any;
  setMessage: React.Dispatch<React.SetStateAction<TypeMessage>>;
}

const ActivityContent: React.FC<ActivityContentProps> = ({
  user,
  responseSchedule,
  setMessage
}) => {

  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  const [open, setOpen] = useState(false); // Controlla la visibilità del messaggio
  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
  const [loading, setLoading] = useState(false);
  const flex = isVertical ? 'flex-start' : 'flex-end';

  const openDetail = (_id: string, componentDidMount: any): void => {
    componentDidMount(_id)
  }

  const pulsanteNew: Pulsante = {
    icona: 'fas fa-plus',
    funzione: () => navigateRouting(navigate, `about`, {}),
    callBackEnd: () => { },
    nome: 'new',
    title: 'Nuovo documento'
  };;

  const pulsanteRed: Pulsante = {
    icona: 'fas fa-download',
    funzione: (_id: string) => fetchDataActivityById(_id, () => showMessage(setOpen, setMessage)),
    callBackEnd: () => { },
    nome: 'red',
    title: 'Carica sottotesto',

  }

  const pulsanteBlue: Pulsante = {
    icona: 'fas fa-eye',
    funzione: (_id: string) => openDetail(_id, () => componentDidMount(_id)), // Passi la funzione direttamente
    callBackEnd: () => { },
    nome: 'blue',
    title: 'Apri dettaglio'
  }

  // const pulsantiVisibili = isVertical ? [pulsanteNew, pulsanteBlue] : [pulsanteNew, pulsanteRed, pulsanteBlue]
  const pulsantiVisibili = [pulsanteNew, pulsanteRed, pulsanteBlue]





  useEffect(() => {

    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Pulisci il listener al dismount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const componentDidMount = (_id: string) => {
    // Effettua la chiamata GET quando il componente è montato
    fetchDataActivityById(_id, () => showMessage(setOpen, setMessage), setLoading)
      .then((response) => {
        if (response.status === HttpStatus.OK) {
          activityStore.setTestoById(_id, response.testo);
          navigateRouting(navigate, `about`, { _id })
          console.log('Dati ricevuti:', response);
        } else {
          setMessage({ message: response.errors, typeMessage: 'error' });
          setOpen(true);
        }
      })
      .catch((error) => {
        console.error('Errore durante il recupero dei dati:', error);
      });
  }
  const handleClose = () => {
    setOpen(false);
  };



  const scheduler: MsSchedule = {
    justifyContent: flex,
    handleClose: handleClose,
    schedule: responseSchedule,
    isVertical: isVertical,
    open: open,
    pulsanti: pulsantiVisibili
  }

  // Crea l'array dei pulsanti in base all'orientamento

  return (
    <>
      <div id="schedule">
        <Schedule
          schedule={scheduler} />
      </div>
    </>
  );
};

export default ActivityContent;
