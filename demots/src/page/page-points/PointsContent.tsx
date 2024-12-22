import React, { useState } from "react";
import "./PointsContent.css";
import { useLocation, useNavigate } from "react-router-dom";
import activityStore from "../page-activity/store/ActivityStore";
import { sezioniMenu, sezioniMenuIniziale, showError } from "../../App";
import { Alert, Box, Grid, Snackbar } from "@mui/material";
import { Pulsante } from "../../components/msbutton/Button";
import Drawer from "../../components/msdrawer/Drawer";
import Card from "../../components/mscard/card";
import { findByEmail } from "./service/PointsService";
import lizard from "../../assets/images/lizard.jpg"; // Percorso del file locale
import LoginIcon from '@mui/icons-material/Login';


const PointsContent: React.FC<any> = ({
  user }) => {


  const location = useLocation();
  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  const { _id } = location.state || {}; // Ottieni il valore dallo stato
  let menuLaterale = sezioniMenu(sezioniMenuIniziale, navigate, `activity`, {}, 0);
  menuLaterale = sezioniMenu(sezioniMenuIniziale, navigate, `about`, {}, 1);
  menuLaterale = sezioniMenu(sezioniMenuIniziale, navigate, `points`, { email: user.email}, 2);


  const [open, setOpen] = useState(false); // Controlla la visibilità del messaggio
  const [errors, setErrors] = useState('Si è verificato un errore! Controlla i dettagli.')
  const [testo, setTesto] = useState('I Points a disposizione sono: ')


  const getUser =(email: any): void => {

    findByEmail(email, () => showError(setOpen, setErrors)).then((response:any) => {
      if (response) {
        if (response.status === 'OK') {
          setTesto(response.testo.numeroPunti)
          console.log('Dati ricevuti:', response);
        } else {
          setErrors(response.errors);
          setOpen(true);
        }
      }
    })
  }
  getUser(user.email);


  const handleClose = () => {
    setOpen(false);
  };

  const pulsanteLog: Pulsante = {
    icona: 'fas fa-clipboard',
    funzione: () => getLogAttivita(user.email), // Passi la funzione direttamente
    nome: 'red',
    title: 'Log Attività',
    visibility: user ? true : false
  };

 

  const getLogAttivita = (email: any): void => {

    findByEmail(email, () => showError(setOpen, setErrors)).then((response:any) => {
      if (response) {
        if (response.status === 'OK') {
        // inserire codice di attività
        } else {
          setErrors(response.errors);
          setOpen(true);
        }
      }
    })
  }

  return (
    <>
      <div>
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid item>
            <Drawer sezioni={menuLaterale} nameMenu="Menu" anchor="left" />
          </Grid>
        </Grid>
        <Box sx={{ paddingLeft: 31, paddingRight: 5, marginTop: 4 }}>
          <Snackbar
            open={open}
            autoHideDuration={6000} // Chiude automaticamente dopo 6 secondi
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Posizione del messaggio
          >
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
              -{errors}
            </Alert>
          </Snackbar>

          {/* Contenitore per i TextField */}
          <Box sx={{ marginBottom: 4 }}>
            <div id="text-box">
              <Card
                _id={_id} // Collega il valore allo stato
                text={testo} title={"Points"} img={lizard} pulsanti={[pulsanteLog]} />
            </div>
          </Box>
        </Box>
      </div>
    </>
  );

}


// Componente che visualizza il testo dallo store


export default PointsContent;
