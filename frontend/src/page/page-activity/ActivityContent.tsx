import { Box } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertConfig } from "../../components/ms-alert/Alert";
import { Pulsante } from "../../components/ms-button/Button";
import Schedule, { MsSchedule } from "../../components/ms-schedule/Schedule";
import { ButtonName, HttpStatus, SectionName, TypeUser } from "../../general/structure/Constant";
import { UserI } from "../../general/structure/Utils";
import { navigateRouting, showMessage } from "../page-home/HomeContent";
import "./ActivityContent.css";
import { findByIdentificativo } from "./service/ActivityService";
import activityStore from "./store/ActivityStore";

interface ActivityContentProps {
  user: UserI;
  responseSchedule: any;
  alertConfig: AlertConfig
  isVertical: boolean;
}

const ActivityContent: React.FC<ActivityContentProps> = ({
  user,
  responseSchedule,
  alertConfig,
  isVertical
}) => {

  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  const [loading, setLoading] = useState(false);
  const flex = isVertical ? 'flex-start' : 'flex-end';


  const openDetail = (_id: string, findActivityByIdentificativo: (_id: string) => void): void => {
    findActivityByIdentificativo(_id)
  }

  const pulsanteNew: Pulsante = {
    icona: 'fas fa-plus',
    funzione: () => navigateRouting(navigate, SectionName.ABOUT, {}),
    nome: ButtonName.NEW,
    title: 'Nuovo documento',
    configDialogPulsante: { message: '', showDialog: false },
    disableButton: user?.type === TypeUser.STANDARD
  };;

  const pulsanteRed: Pulsante = {
    icona: 'fas fa-download',
    funzione: (_id: string) => findByIdentificativo({
      _id: _id
    }, (message) => showMessage(alertConfig.setOpen, alertConfig.setMessage, message)),
    nome: ButtonName.RED,
    title: 'Carica sottotesto',
    configDialogPulsante: { message: '', showDialog: false }
  }

  const pulsanteBlue: Pulsante = {
    icona: 'fas fa-eye',
    funzione: (_id: string) => openDetail(_id, () => findActivityByIdentificativo(_id)), // Passi la funzione direttamente
    nome: ButtonName.BLUE,
    title: 'Apri dettaglio',
    configDialogPulsante: { message: '', showDialog: false }
  }

  // const pulsantiVisibili = isVertical ? [pulsanteNew, pulsanteBlue] : [pulsanteNew, pulsanteRed, pulsanteBlue]
  const pulsantiVisibili = [pulsanteNew, pulsanteRed, pulsanteBlue]


  const findActivityByIdentificativo = (_id: string) => {
    // Effettua la chiamata GET quando il componente è montato
    findByIdentificativo({
      _id: _id
    }, (message) => showMessage(alertConfig.setOpen, alertConfig.setMessage, message), setLoading)
      .then((response) => {
        if (response?.status === HttpStatus.OK) {
          activityStore.setActivityById(_id, response.jsonText);
          navigateRouting(navigate, SectionName.ABOUT, { _id })
        }
      })
      .catch((error) => {
        console.error('Errore durante il recupero dei dati:', error);
      });
  }
  const handleClose = () => {
    alertConfig.setOpen(false);
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
