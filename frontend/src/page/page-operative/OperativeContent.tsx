import { Box, FormControl, Input, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import Grid from '@mui/material/Grid2';
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { showMessage } from "../../App";
import Button, { Pulsante } from "../../components/ms-button/Button";
import { ButtonName, HttpStatus } from "../../general/Constant";
import { FormErrorValues, ResponseI, UserI, verifyForm } from "../../general/Utils";
import { ActivityLogI } from "../page-activity/Activity";
import { fetchDataActivities, savePointsAndLog } from "../page-activity/service/ActivityService";
import { TypeMessage } from "../page-layout/PageLayout";
import { findByEmail } from "../page-points/service/PointsService";
import { showMessageOperativeForm } from "./service/OperativeService";
import operativeStore from "./store/OperativeStore";

interface OperativeContentProps {
  user: UserI;
  setMessage: React.Dispatch<React.SetStateAction<TypeMessage>>;
  setOpen: any;
  isVertical: boolean;
}

const OperativeContent: React.FC<OperativeContentProps> = ({
  user,
  setMessage,
  setOpen,
  isVertical
}) => {

  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingO, setIsLoadingO] = useState(true);
  const [disableButtonSave, setDisableButtonSave] = useState(true);

  // Stato per i valori dei campi
  type FormValues = {
    [key: string]: string | undefined;
  };

  const [formValues, setFormValues] = useState<FormValues>({
    activity: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrorValues>({
    activity: true,
    points: true,
  });

  useEffect(() => {
    const errors: FormErrorValues = verifyForm(formValues);
    setDisableButtonSave(Object.keys(errors).filter((key) => errors[key] === true).length > 0)
    if (user.type === 1) {
      operativeStore.setEmailField(user.email);
    }
    else {
      operativeStore.setEmailField(user.emailFamily);
    }
    fetchOptions();
    fetchPoints();
   

    // Pulisci il listener al dismount
    return () => {};
  }, []);

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
      saveActivity(user); // Chiama la funzione per salvare i dati
    } else {
      const erroriCampi = Object.keys(formErrors).filter((key) => errors[key] === true);
      let errorFields: string[] = [];
      if (erroriCampi.length > 0) {
        errorFields = ["I valori invalidi sono:"].concat(erroriCampi);

      }
      showMessageOperativeForm((message?: TypeMessage) => showMessage(setOpen, setMessage, { ...message, message: errorFields }));
    }
  };

  const handleChangePoints = (event: React.ChangeEvent<HTMLInputElement>) => {
    operativeStore.setPoints(parseInt(event.target.value)); // Aggiorna lo stato con il valore inserito
  };

  const fetchOptions = () => {
    try {
      const emailFind = user.emailFamily ? user.emailFamily : user.email;

      return fetchDataActivities({ ...user, email: emailFind }).then((response: ResponseI | undefined) => {
        setIsLoadingO(false);
        operativeStore.setActivity(response?.jsonText ?? []);
      })
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  const fetchPoints = () => {
    try {
      const emailFind = user.emailFamily ? user.emailFamily : user.email;

      findByEmail({ ...user, email: emailFind }, (message: any) => showMessage(setOpen, setMessage, message)).then((response: ResponseI|undefined) => {
        if (response) {
          if (response.status === HttpStatus.OK) {
            setIsLoading(false);
            operativeStore.setPoints(response.jsonText.points);
          }
        }
      })
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  const pulsanteSave: Pulsante = {
    icona: 'fas fa-save',
    funzione: () => handleButtonClick(),
    nome:  ButtonName.RED,
    disableButton: disableButtonSave,
    title: 'Salva',
    configDialogPulsante: { message: "Vuoi salvare?", showDialog: true }

  }


  const clickCombobox = (selectedValue: string) => {

    // Imposta il valore selezionato nel combobox
    //setComboBoxValue(selectedValue);
    setFormValues({ ...formValues, activity: selectedValue })



    // Trova l'attività selezionata tramite l'ID
    const selectedActivity = operativeStore.activity.find(item => item._id === selectedValue);

    // Se l'attività non è trovata, mostra un errore
    if (!selectedActivity) {
      console.error('Activity not found');
      return; // Esci dalla funzione se non trovi l'attività
    }

    // Imposta il valore dei punti in base all'attività selezionata
    operativeStore.setPointsField(selectedActivity.points!);
  };


  const saveActivity = (user: UserI) => {
    // Trova l'attività selezionata nell'array
    const selectedActivity = operativeStore.activity.find(item => item._id === formValues.activity);

    // Se l'attività selezionata non esiste, gestisci l'errore
    if (!selectedActivity) {
      console.error('Activity not found');
      return; // Esci dalla funzione se non trovi l'attività
    }
    const emailFind = user.emailFamily ? user.emailFamily : user.email;

    // Crea il log dell'attività
    const activityLog: ActivityLogI = {
      ...user,
      log: selectedActivity.nome, // Non è necessario usare '!' se hai fatto il check
      date: new Date(),
      usePoints: operativeStore.pointsField,
      email: emailFind
    };

    // Salva il log dell'attività
    savePointsAndLog(activityLog, (message?: TypeMessage) => showMessage(setOpen, setMessage, message))
      .then((response: ResponseI | undefined) => {
        fetchPoints();
      })
  };
  if (isLoading || isLoadingO) {
    return <p>Caricamento...</p>; // Mostra un loader mentre i dati vengono caricati
  }

  return (
    <>
      <div className="row">
        <Box sx={{ padding: 2 }}>
          <Grid container spacing={2}>
            {/* Prima riga */}
            <Grid size={{ xs: 12, sm: 6 }}>
              {/* Campo stringa 1 */}
              <FormControl fullWidth >
                <TextField
                  label="Email"
                  value={operativeStore.emailField}
                  onChange={(e) => operativeStore.setEmailField(e.target.value)}
                  fullWidth
                  margin="normal"
                  disabled={true} // Disabilita il campo
                />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl sx={{ marginTop: '16px', width: '100%' }} variant="standard">
                <InputLabel htmlFor="filled-points">{'Points'}</InputLabel>
                <Input
                  id="filled-adornment-points"
                  value={operativeStore.points} // Collega il valore allo stato
                  onChange={handleChangePoints} // Aggiorna lo stato quando cambia
                  disabled={true}
                />
              </FormControl>
            </Grid>

            {/* Seconda riga */}
            <Grid size={{ xs: 12, sm: 6 }}>
              {/* Campo combobox */}
              <FormControl fullWidth margin="normal">
                <InputLabel id="select-label">
                  Activity<span > *</span>
                </InputLabel>
                <Select
                  labelId="select-label"
                  value={formValues.activity}
                  onChange={(e) => clickCombobox(e.target.value)}
                  label="Activity"
                  required={true}
                >
                  {operativeStore.activity.map((option) => (
                    <MenuItem key={option._id} value={option._id}>
                      {option.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

            </Grid>
            {/* Campo con punti */}
            <Grid size={{ xs: 12, sm: 6 }}>
              {/* Campo numerico */}
              <FormControl fullWidth >
                <TextField
                  label="Points Activity"
                  type="number"
                  value={operativeStore.pointsField}
                  onChange={(e) => operativeStore.setPointsField(parseInt(e.target.value, 10))}
                  margin="normal"
                  disabled={true} // Disabilita il campo

                />
              </FormControl>

            </Grid>
          </Grid>

          {/* Pulsante Salva */}
          <Grid container justifyContent="flex-end" spacing={1}>
            <Button pulsanti={[pulsanteSave]} />

          </Grid>
        </Box>
      </div>
    </>
  );

};


export default OperativeContent;
