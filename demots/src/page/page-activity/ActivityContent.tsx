import React, { useEffect, useState } from "react";
import activityStore from "./store/ActivityStore";  // Importa lo store
import "./ActivityContent.css";
import { useNavigate } from "react-router-dom";
import { fetchDataActivityById } from "./service/ActivityService";
import { navigateRouting, sezioniMenu, sezioniMenuIniziale, showError } from "../../App";
import { Pulsante } from "../../components/msbutton/Button";
import Schedule, { MsSchedule } from "../../components/msschedule/Schedule";
import { UserI } from "../../general/Utils";


interface ActivityContentProps {
  user: UserI;
  responseSchedule: any;
}

const ActivityContent: React.FC<ActivityContentProps> = ({
  responseSchedule,
  user,
}) => {

  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  let menuLaterale = sezioniMenu(sezioniMenuIniziale, navigate, `activity`, {}, 0);
  menuLaterale = sezioniMenu(sezioniMenuIniziale, navigate, `about`, {}, 1);
  menuLaterale = sezioniMenu(sezioniMenuIniziale, navigate, `points`, { email: user.email }, 2);

  const [labelText] = React.useState('Nessun dato aggiuntivo'); // Stato dinamico per il testo della label
  const [open, setOpen] = useState(false); // Controlla la visibilità del messaggio
  const [errors, setErrors] = useState('Si è verificato un errore! Controlla i dettagli.')
  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
  const [loading, setLoading] = useState(false);
  const [visibilityButton, setVisibilityButton] = useState<boolean>(true); // Stato iniziale vuoto
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
    funzione: () => { },
    callBackEnd: (_id: string) => fetchDataActivityById(_id, () => showError(setOpen, setErrors)),
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

  const pulsantiVisibili = isVertical ? [pulsanteNew, pulsanteBlue] : [pulsanteNew, pulsanteRed, pulsanteBlue]





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
    fetchDataActivityById(_id, () => showError(setOpen, setErrors), setLoading)
      .then((response) => {
        if (response.status === 'OK') {
          activityStore.setTestoById(_id, response.testo);
          navigateRouting(navigate, `about`, { _id })
          console.log('Dati ricevuti:', response);
        } else {
          setErrors(response.errors);
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
    errors: errors,
    visibilityButton: isVertical,
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
