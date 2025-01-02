import { Box, Grid } from "@mui/material";
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { navigateRouting, showMessage } from "../../App";
import Button, { Pulsante } from "../../components/msbutton/Button";
import { FormErrorValues, HttpStatus, TypeUser, UserI, verifyForm } from "../../general/Utils";
import { ActivityI } from "../page-activity/Activity";
import activityStore from "../page-activity/store/ActivityStore";
import { TypeMessage } from "../page-layout/PageLayout";
import "./About.css";
import { deleteAboutById, saveAboutByUser, showMessageAboutForm } from "./service/AboutService";

interface AboutContentProps {
  user: UserI;
  setMessage: React.Dispatch<React.SetStateAction<TypeMessage>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AboutContent: React.FC<AboutContentProps> = ({
  user,
  setMessage,
  setOpen
}) => {

  const location = useLocation();
  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  const { _id } = location.state || {}; // Ottieni il valore dallo stato
  const [disableButtonSave, setDisableButtonSave] = useState(true);
  let testoOld = activityStore.activity.find((x) => _id === x._id);
  const activityLabel: ActivityI = {
    _id: undefined,
    nome: "Attività",
    subTesto: "Descrizione"
  }

  const labelFamily = {
    email: "Email  tutore",
    emailFamily: "Email figlio",
  }

  testoOld = activityLabel;
  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
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

  useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
    };
    const errors: FormErrorValues = verifyForm(formValues);
    setDisableButtonSave(Object.keys(errors).filter((key) => errors[key] === true).length > 0)

    window.addEventListener("resize", handleResize);
    // Pulisci il listener al dismount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      console.log('Form submitted:', formValues);
      salvaRecord(_id); // Chiama la funzione per salvare i dati
    } else {
      console.log('Validation errors:', errors);
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
    nome: 'red',
    title: 'Elimina',
    visibility: _id ? true : false,
    configDialogPulsante: { message: 'Vuoi eliminare il record?', showDialog: true }

  };

  const pulsanteBlue: Pulsante = {
    icona: 'fas fa-solid fa-floppy-disk',
    funzione: () => handleButtonClick(), // Passi la funzione direttamente
    disableButton: disableButtonSave,
    nome: 'blue',
    title: 'Salva',
    configDialogPulsante: { message: 'Vuoi salvare il record?', showDialog: true }

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
          navigateRouting(navigate, 'activity', {})
        }
      }
    })
  }

  const salvaRecord = (_id: string): void => {
    const emailFind = user.emailFamily ? user.emailFamily : user.email;
    const testo = {
      ...user,
      _id: _id,
      nome: formValues.activity,
      subTesto: subTesto,
      points: formValues.points,
      email: emailFind
    }
    saveAboutByUser(testo, (message?: TypeMessage) => showMessage(setOpen, setMessage, message)).then((response) => {
      if (response?.testo) {
        navigateRouting(navigate, 'activity', {})
      }
    })
  }

  return (
    <>
      <div className="row">
        <Box sx={{ padding: 2 }}>
          <div id="text-box-email-family">
            <TextField
              id="emailFamily"
              label={labelFamily.emailFamily}
              variant="standard"
              value={user.emailFamily} // Collega il valore allo stato
              onChange={handleChangeEmailFamily} // Aggiorna lo stato quando cambia
              fullWidth
              disabled={true}
            />
          </div>

          <div id="text-box-email" style={{ marginTop: '16px' }}>
            <TextField
              id="email"
              label={labelFamily.email}
              variant="standard"
              value={user.email} // Collega il valore allo stato
              onChange={handleChangeEmail} // Aggiorna lo stato quando cambia
              fullWidth
              disabled={true}
              multiline
              InputLabelProps={{
                style: {
                  whiteSpace: 'normal', // Permette al testo di andare a capo
                  wordWrap: 'break-word', // Interrompe le parole lunghe
                },
              }}
            />
          </div>

          <div id="text-box">
            <TextField
              id="activity"
              label={testoOld.nome}
              variant="standard"
              value={formValues.activity} // Collega il valore allo stato
              onChange={handleChangeActivity} // Aggiorna lo stato quando cambia
              fullWidth
              required={true}
            />
          </div>
          <div id="text-box">
            <TextField
              id="points"
              label={'Points'}
              variant="standard"
              value={formValues.points} // Collega il valore allo stato
              onChange={handleChangePoints} // Aggiorna lo stato quando cambia
              fullWidth
              type="number"
              disabled={user.type === TypeUser.STANDARD}
              required={true}
            />
          </div>
          <div id="text-box-sub-testo" style={{ marginTop: '16px' }}>
            <TextField
              id="subTesto"
              label={testoOld.subTesto}
              variant="standard"
              value={subTesto} // Collega il valore allo stato
              onChange={handleChangeSubTesto} // Aggiorna lo stato quando cambia
              fullWidth
              multiline
              rows={10} // Numero di righe visibili per il campo
              InputLabelProps={{
                style: {
                  whiteSpace: 'normal', // Permette al testo di andare a capo
                  wordWrap: 'break-word', // Interrompe le parole lunghe
                },
              }}
            />
          </div>
        </Box>

        {/* Pulsanti */}
        <Grid container justifyContent="flex-end" spacing={2}>
          <Grid item>
            <Button pulsanti={[pulsanteRed, pulsanteBlue]} />
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default AboutContent;
