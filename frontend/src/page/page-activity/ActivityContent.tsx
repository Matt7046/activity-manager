import { Box } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { navigateRouting, showMessage } from "../../App";
import { Pulsante } from "../../components/ms-button/Button";
import Schedule, { MsSchedule } from "../../components/ms-schedule/Schedule";
import { ButtonName, HttpStatus, SectionName, TypeAlertColor, TypeUser } from "../../general/Constant";
import { UserI } from "../../general/Utils";
import { TypeMessage } from "../page-layout/PageLayout";
import "./ActivityContent.css";
import { findByIdentificativo } from "./service/ActivityService";
import activityStore from "./store/ActivityStore";

interface ActivityContentProps {
  user: UserI;
  responseSchedule: any;
  setMessage: React.Dispatch<React.SetStateAction<TypeMessage>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isVertical: boolean;
}

const ActivityContent: React.FC<ActivityContentProps> = ({
  user,
  responseSchedule,
  setMessage,
  setOpen,
  isVertical
}) => {

  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  const [loading, setLoading] = useState(false);
  const flex = isVertical ? 'flex-start' : 'flex-end';

  const openDetail = (_id: string, findActivityByIdentificativo:  (_id: string ) => void): void => {
    findActivityByIdentificativo(_id)
  }

  const pulsanteNew: Pulsante = {
    icona: 'fas fa-plus',
    funzione: () => navigateRouting(navigate, SectionName.ABOUT, {}),
    nome:  ButtonName.NEW,
    title: 'Nuovo documento',
    configDialogPulsante: {message:'', showDialog:false},
    disableButton : user.type === TypeUser.STANDARD
  };;

  const pulsanteRed: Pulsante = {
    icona: 'fas fa-download',
    funzione: (_id: string) => findByIdentificativo({
      _id: _id   
    }, (message) => showMessage(setOpen, setMessage, message)),
    nome: ButtonName.RED,
    title: 'Carica sottotesto',
    configDialogPulsante: {message:'', showDialog:false}
  }

  const pulsanteBlue: Pulsante = {
    icona: 'fas fa-eye',
    funzione: (_id: string) => openDetail(_id, () => findActivityByIdentificativo(_id)), // Passi la funzione direttamente
    nome:  ButtonName.BLUE,
    title: 'Apri dettaglio',
    configDialogPulsante: {message:'', showDialog:false}
  }

  // const pulsantiVisibili = isVertical ? [pulsanteNew, pulsanteBlue] : [pulsanteNew, pulsanteRed, pulsanteBlue]
  const pulsantiVisibili = [pulsanteNew, pulsanteRed, pulsanteBlue]
 

  const findActivityByIdentificativo = (_id: string) => {
    // Effettua la chiamata GET quando il componente è montato
    findByIdentificativo({
      _id: _id 
    }, (message) => showMessage(setOpen, setMessage, message), setLoading)
      .then((response) => {
        if (response?.status === HttpStatus.OK) {
          activityStore.setActivityById(_id, response.jsonText);
          navigateRouting(navigate, SectionName.ABOUT, { _id })
          console.log('Dati ricevuti:', response);
        } else {
          setMessage({ message: response?.errors, typeMessage: TypeAlertColor.ERROR });
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
    pulsanti: pulsantiVisibili
  }

  // Crea l'array dei pulsanti in base all'orientamento

  return (
    <>    
        <Box className='box-activity'>         
            <Schedule
              schedule={scheduler} />        
        </Box>     
    </>
  );
};

export default ActivityContent;
