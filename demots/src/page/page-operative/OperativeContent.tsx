import { Box, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showMessage } from "../../App";
import Button, { Pulsante } from "../../components/msbutton/Button";
import { ResponseI, UserI } from "../../general/Utils";
import { ActivityI, ActivityLogI } from "../page-activity/Activity";
import { fetchDataActivity, saveActivityLog } from "../page-activity/service/ActivityService";
import { TypeMessage } from "../page-layout/PageLayout";
import "./Operative.css";

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
  const [comboBoxValue, setComboBoxValue] = useState('');

  const fetchOptions = () => {
    try {
      const emailFind = user.emailFamily ? user.emailFamily: user.email;

      fetchDataActivity({...user, email: emailFind}).then((response: ResponseI | undefined) => {
        setActivity(response?.testo);
      })
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  useEffect(() => {
    fetchOptions();
    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Pulisci il listener al dismount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pulsanteSave: Pulsante = {
    icona: 'fas fa-save',
    funzione : () => saveActivity(user),
    nome: 'red',
    title: 'Salva',
    configDialogPulsante: {message:"Vuoi salvare?", showDialog:true}

  }


  const clickCombobox = (e: SelectChangeEvent<string>) => {
    const selectedValue = e.target.value;
  
    // Imposta il valore selezionato nel combobox
    setComboBoxValue(selectedValue);
  
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
    const selectedActivity = activity.find(item => item._id === comboBoxValue); 

    // Se l'attività selezionata non esiste, gestisci l'errore
    if (!selectedActivity) {
      console.error('Activity not found');
      return; // Esci dalla funzione se non trovi l'attività
    }
    const emailFind = user.emailFamily ? user.emailFamily: user.email;

    // Crea il log dell'attività
    const activityLog: ActivityLogI = {
      ...user,
      log: selectedActivity.nome, // Non è necessario usare '!' se hai fatto il check
      date: new Date(),
      usePoints: pointsField,
      email: emailFind
    };
  
    // Salva il log dell'attività
    saveActivityLog(activityLog, (message?: TypeMessage) => showMessage(setOpen, setMessage, message));
  };
  

  return (
    <>
      <div className="row">

        <Box sx={{ padding: 2 }}>

          {/* Campo stringa 1 */}
          <TextField
            label="Email"
            value={emailField}
            onChange={(e) => setEmailField(e.target.value)}
            fullWidth
            margin="normal" 
            disabled={true}  // Disabilita il campo         
          />

          {/* Campo Combobox */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="select-label">Activity</InputLabel>
            <Select
              labelId="select-label"
              value={comboBoxValue}
              onChange={(e) =>  clickCombobox(e)}
              label="Activity"
            >
              {activity.map((option) => (
                <MenuItem key={option._id} value={option._id}>
                  {option.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Campo numerico */}
          <TextField
            label="Points"
            type="number"
            value={pointsField}
            onChange={(e) => setPointsField(parseInt(e.target.value, 10))}            fullWidth
            margin="normal"
            disabled={true}  // Disabilita il campo
          />
          <Grid container justifyContent="flex-end" spacing={1}>
            <Grid item>
              <Button pulsanti={[pulsanteSave]} />
            </Grid>
          </Grid>
          {/* Pulsante Salva */}
        </Box>
      </div>
    </>
  );
};


export default OperativeContent;
