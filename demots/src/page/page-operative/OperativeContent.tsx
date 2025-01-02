import { Box, FormControl, Grid, Input, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showMessage } from "../../App";
import Button, { Pulsante } from "../../components/msbutton/Button";
import { HttpStatus, ResponseI, UserI } from "../../general/Utils";
import { ActivityI, ActivityLogI } from "../page-activity/Activity";
import { fetchDataActivity, saveActivityLog } from "../page-activity/service/ActivityService";
import { TypeMessage } from "../page-layout/PageLayout";
import { findByEmail } from "../page-points/service/PointsService";
import "./Operative.css";
import { showMessageOperativeForm } from "./service/OperativeService";

interface OperativeContentProps {
  user: UserI;
  setMessage: React.Dispatch<React.SetStateAction<TypeMessage>>;
  setOpen: any;
}

const OperativeContent: React.FC<OperativeContentProps> = ({
  user,
  setMessage,
  setOpen
}) => {

  const location = useLocation();
  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  const { _id } = location.state || {}; // Ottieni il valore dallo stato
  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
  const padding = isVertical ? 5 : 8;
  const [pointsField, setPointsField] = useState(0);
  const [emailField, setEmailField] = useState(user.email);
  const [activity, setActivity] = useState([] as ActivityI[]);
  //const [comboBoxValue, setComboBoxValue] = useState('');
  const [points, setPoints] = useState<number>(0);

  // Stato per i valori dei campi
  type FormValues = {
    [key: string]: string | undefined;
  };

  type FormErrorValues = {
    [key: string]: boolean | undefined;
  };

  const [formValues, setFormValues] = useState<FormValues>({
    activity: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrorValues>({
    activity: true,
    points: true,
  });



  const handleButtonClick = () => {
    const errors: FormErrorValues = {};

    // Controlla se i campi sono vuoti o non validi
    Object.keys(formValues).forEach((key) => {
      if (
        formValues[key] === null || // Valore nullo
        formValues[key] === undefined || // Valore non definito
        (typeof formValues[key] === 'string' && (formValues[key] as string)!.trim() === '') // Stringa vuota         
      ) {
        errors[key] = true; // Imposta errore per il campo
      }
      else {
        errors[key] = false; // Imposta errore per il campo
      }
    });

    setFormErrors(errors);

    // Procedi solo se non ci sono errori
    if (Object.keys(errors).filter((key) => errors[key] === true).length === 0) {
      console.log('Form submitted:', formValues);
      saveActivity(user); // Chiama la funzione per salvare i dati
    } else {
      console.log('Validation errors:', errors);
      const erroriCampi = Object.keys(formErrors).filter((key) => errors[key] === true);
      let errorFields: string[] = [];
      if (erroriCampi.length > 0) {
        errorFields = ["I valori invalidi sono:"].concat(erroriCampi);

      }
      showMessageOperativeForm((message?: TypeMessage) => showMessage(setOpen, setMessage, { ...message, message: errorFields }));
    }
  };

  const handleChangePoints = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPoints(parseInt(event.target.value)); // Aggiorna lo stato con il valore inserito
  };

  const fetchOptions = () => {
    try {
      const emailFind = user.emailFamily ? user.emailFamily : user.email;

      fetchDataActivity({ ...user, email: emailFind }).then((response: ResponseI | undefined) => {
        setActivity(response?.testo ?? []);
      })
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  const fetchPoints = () => {
    try {
      const emailFind = user.emailFamily ? user.emailFamily : user.email;

      findByEmail({ ...user, email: emailFind }, (message: any) => showMessage(setOpen, setMessage, message)).then((response: ResponseI) => {
        if (response) {
          if (response.status === HttpStatus.OK) {
            setPoints(response.testo.points);
            console.log('Dati ricevuti:', response);
          }
        }
      })
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };


  useEffect(() => {
    fetchOptions();
    fetchPoints();
    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);

    };

    window.addEventListener("resize", handleResize);

    // Pulisci il listener al dismount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pulsanteSave: Pulsante = {
    icona: 'fas fa-save',
    funzione: () => handleButtonClick(),
    nome: 'red',
    title: 'Salva',
    configDialogPulsante: { message: "Vuoi salvare?", showDialog: true }

  }


  const clickCombobox = (selectedValue: string) => {

    // Imposta il valore selezionato nel combobox
    //setComboBoxValue(selectedValue);
    setFormValues({ ...formValues, activity: selectedValue })



    // Trova l'attività selezionata tramite l'ID
    const selectedActivity = activity.find(item => item._id === selectedValue);

    // Se l'attività non è trovata, mostra un errore
    if (!selectedActivity) {
      console.error('Activity not found');
      return; // Esci dalla funzione se non trovi l'attività
    }

    // Imposta il valore dei punti in base all'attività selezionata
    setPointsField(selectedActivity.points!);
  };


  const saveActivity = (user: UserI) => {
    // Trova l'attività selezionata nell'array
    const selectedActivity = activity.find(item => item._id === formValues.activity);

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
      usePoints: pointsField,
      email: emailFind
    };

    // Salva il log dell'attività
    saveActivityLog(activityLog, (message?: TypeMessage) => showMessage(setOpen, setMessage, message))
      .then((response: ResponseI | undefined) => {
        fetchPoints();
      })
  };

  return (
    <>
      <div className="row">
        <Box sx={{ padding: 2 }}>
          <Grid container spacing={2}>
            {/* Prima riga */}
            <Grid item xs={12} sm={6}>
              {/* Campo stringa 1 */}
              <TextField
                label="Email"
                value={emailField}
                onChange={(e) => setEmailField(e.target.value)}
                fullWidth
                margin="normal"
                disabled={true} // Disabilita il campo
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl sx={{ marginTop: '16px', width: '100%' }} variant="standard">
                <InputLabel htmlFor="filled-points">{'Points'}</InputLabel>
                <Input
                  id="filled-adornment-points"
                  value={points} // Collega il valore allo stato
                  onChange={handleChangePoints} // Aggiorna lo stato quando cambia
                  disabled={true}
                />
              </FormControl>
            </Grid>

            {/* Seconda riga */}
            <Grid item xs={12} sm={6}>
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
                  {activity.map((option) => (
                    <MenuItem key={option._id} value={option._id}>
                      {option.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

            </Grid>
            {/* Campo con punti */}
            <Grid item xs={6} sm={6}>
              {/* Campo numerico */}
              <TextField
                label="Points Activity"
                type="number"
                value={pointsField}
                onChange={(e) => setPointsField(parseInt(e.target.value, 10))}
                fullWidth
                margin="normal"
                disabled={true} // Disabilita il campo
              />
            </Grid>
          </Grid>

          {/* Pulsante Salva */}
          <Grid container justifyContent="flex-end" spacing={1}>
            <Grid item>
              <Button pulsanti={[pulsanteSave]} />
            </Grid>
          </Grid>
        </Box>
      </div>
    </>
  );

};


export default OperativeContent;
