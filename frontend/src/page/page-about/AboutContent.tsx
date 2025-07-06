import { Box } from "@mui/material";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button, { Pulsante } from "../../components/ms-button/Button";
import { ButtonName, HttpStatus, SectionName, TypeUser } from "../../general/structure/Constant";
import { FormErrorValues, UserI, verifyForm } from "../../general/structure/Utils";
import { ActivityI } from "../page-activity/Activity";
import { deleteAboutById, saveActivity, showMessageAboutForm } from "../page-activity/service/ActivityService";
import activityStore from "../page-activity/store/ActivityStore";
import { navigateRouting, showMessage } from "../page-home/HomeContent";
import { TypeMessage } from "../page-layout/PageLayout";
import "./AboutContent.css";


interface AboutContentProps {
  user: UserI;
  setMessage: React.Dispatch<React.SetStateAction<TypeMessage>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isVertical: boolean;
}

const AboutContent: React.FC<AboutContentProps> = ({
  user,
  setMessage,
  setOpen,
  isVertical
}) => {

  const location = useLocation();
  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  const [disableButtonSave, setDisableButtonSave] = useState<boolean>();
  const { _id } = location.state || {}; // Ottieni il valore dallo stato
  const [disableButtonDelete, setDisableButtonDelete] = useState<boolean>(_id === null || _id === undefined);


  let testoOld = activityStore.activity.find((x) => _id === x._id);
  const activityLabel: ActivityI = {
    _id: undefined,
    nome: "Attività",
    subTesto: "Descrizione"
  }

  const labelFamily = {
    email: "Email",
    emailFamily: user.type === 0 ? "Email" : "Email child",
  }

  testoOld = activityLabel;
  const [subTesto, setSubTesto] = useState(activityStore.activity.find((x) => _id === x._id)?.subTesto);

  // Stato per i valori dei campi
  type FormValues = {
    [key: string]: string | number | undefined;
  };


  const [formValues, setFormValues] = useState<FormValues>({
    activity: activityStore.activity.find((x) => _id === x._id)?.nome,
    points: activityStore.activity.find((x) => _id === x._id)?.points,
  });

  const [formErrors, setFormErrors] = useState<FormErrorValues>({
    activity: true,
    points: true,
  });

  // Effetto per catturare i cambiamenti di formValues
  useEffect(() => {
    const errors: FormErrorValues = verifyForm(formValues);
    setDisableButtonSave(Object.keys(errors).filter((key) => errors[key] === true).length > 0)
    // Puoi aggiungere altre azioni da eseguire quando formValues cambia
  }, [formValues]); // Dipendenza su formValues


  const handleButtonClick = () => {
    const errors: FormErrorValues = verifyForm(formValues);
    setFormErrors(errors);

    // Procedi solo se non ci sono errori
    if (Object.keys(errors).filter((key) => errors[key] === true).length === 0) {
      salvaRecord(_id); // Chiama la funzione per salvare i dati
    } else {
      const erroriCampi = Object.keys(formErrors).filter((key) => errors[key] === true);
      let errorFields: string[] = [];
      if (erroriCampi.length > 0) {
        errorFields = ["I valori invalidi sono:"].concat(erroriCampi);

      }
      showMessageAboutForm((message?: TypeMessage) => showMessage(setOpen, setMessage, { ...message, message: errorFields }));
    }
  };




  const pulsanteRed: Pulsante = {
    icona: 'fas fa-solid fa-trash',
    funzione: () => cancellaRecord(_id), // Passi la funzione direttamente
    disableButton: disableButtonDelete,
    nome: ButtonName.RED,
    title: 'Elimina',
    visibility: _id ? true : false,
    configDialogPulsante: { message: 'Vuoi eliminare il record?', showDialog: true }

  };

  const pulsanteBlue: Pulsante = {
    icona: 'fas fa-solid fa-floppy-disk',
    funzione: () => handleButtonClick(), // Passi la funzione direttamente
    disableButton: disableButtonSave,
    nome: ButtonName.BLUE,
    title: 'Salva',
    configDialogPulsante: { message: 'Vuoi salvare il record?', showDialog: true }

  };

  const pulsanteReturn: Pulsante = {
    icona: 'fas fa-arrow-left',
    funzione: () => returnActivity(), // Passi la funzione direttamente
    //disableButton: disableButtonSave,
    nome: ButtonName.BACK,
    title: 'Ritorna',
    configDialogPulsante: { message: '', showDialog: false }

  };

  const handleChangeActivity = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, activity: event.target.value })
    // setActivity(event.target.value); // Aggiorna lo stato con il valore inserito
  };

  const handleChangePoints = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, points: parseInt(event.target.value) })
    //setPoints(parseInt(event.target.value)); // Aggiorna lo stato con il valore inserito
  };

  const handleChangeSubTesto = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubTesto(event.target.value); // Aggiorna lo stato con il valore inserito    
  };

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
  };

  const handleChangeEmailFamily = (event: React.ChangeEvent<HTMLInputElement>) => {
  };


  const handleClose = () => {
    setOpen(false);
  };

  // Crea l'array dei pulsanti in base all'orientamento

  const cancellaRecord = (_id: string): void => {

    deleteAboutById(_id, (message?: TypeMessage) => showMessage(setOpen, setMessage, message)).then((response) => {
      if (response) {
        if (response.status === HttpStatus.OK) {
          navigateRouting(navigate, SectionName.ACTIVITY, {})
        }
      }
    })
  }
  const returnActivity = (): void => {
    navigateRouting(navigate, SectionName.ACTIVITY, {})
  }

  const salvaRecord = (_id: string): void => {
    const emailFind = user.emailChild ? user.emailChild : user.email;
    const testo = {
      ...user,
      _id: _id,
      nome: formValues.activity,
      subTesto: subTesto,
      points: formValues.points,
      email: emailFind
    }
    saveActivity(testo, (message?: TypeMessage) => showMessage(setOpen, setMessage, message)).then((response) => {
      if (response?.jsonText) {
        setDisableButtonDelete(false);
        navigateRouting(navigate, SectionName.ACTIVITY, {})
      }
    })
  }

  return (
    <>
      <Box className='box-about'>
        <TextField
          id="emailFamily"
          label={labelFamily.email}
          variant="standard"
          value={user.email} // Collega il valore allo stato
          onChange={handleChangeEmailFamily} // Aggiorna lo stato quando cambia
          fullWidth
          disabled={true}
        />
        <Grid container spacing={2}>
          <Grid xs={12} sm={6}>
            <TextField
              id="activity"
              label={testoOld.nome}
              variant="standard"
              value={formValues.activity} // Collega il valore allo stato
              onChange={handleChangeActivity} // Aggiorna lo stato quando cambia
              fullWidth
              required={true}
            />
          </Grid>
          <Grid xs={12} sm={6}>
            <TextField
              id="points"
              label={'Punti'}
              variant="standard"
              value={formValues.points} // Collega il valore allo stato
              onChange={handleChangePoints} // Aggiorna lo stato quando cambia
              fullWidth
              type="number"
              disabled={user.type === TypeUser.STANDARD}
              required={true}
            />
          </Grid>
        </Grid>
        <TextField
          id="subTesto"
          label={testoOld.subTesto}
          variant="standard"
          value={subTesto} // Collega il valore allo stato
          onChange={handleChangeSubTesto} // Aggiorna lo stato quando cambia
          fullWidth
          multiline
          rows={10} // Numero di righe visibili per il campo
         />
        <Grid container justifyContent="space-between" spacing={2} className='grid-button-about'>
          <Button pulsanti={[pulsanteReturn]} />

          <Button pulsanti={[pulsanteRed, pulsanteBlue]} />
        </Grid>
      </Box >
    </>
  );
}

export default AboutContent;
