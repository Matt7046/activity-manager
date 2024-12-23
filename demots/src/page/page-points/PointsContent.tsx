import React, { useEffect, useState } from "react";
import "./PointsContent.css";
import { useLocation, useNavigate } from "react-router-dom";
import activityStore from "../page-activity/store/ActivityStore";
import { sezioniMenu, sezioniMenuIniziale, showError } from "../../App";
import { Alert, Box, Grid, Snackbar } from "@mui/material";
import { Pulsante } from "../../components/msbutton/Button";
import Drawer from "../../components/msdrawer/Drawer";
import Card from "../../components/mscard/card";
import lizard from "../../assets/images/lizard.jpg"; // Percorso del file locale
import points from "../../assets/images/points.jpg"; // Percorso del file locale
import CardGrid from "../../components/mscard/card";
import { logActivityByEmail } from "../page-activity/service/ActivityService";
import { findByEmail } from "./service/PointsService";


const PointsContent: React.FC<any> = ({
  user }) => {


  const location = useLocation();
  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  const { _id } = location.state || {}; // Ottieni il valore dallo stato
  let menuLaterale = sezioniMenu(sezioniMenuIniziale, navigate, `activity`, {}, 0);
  menuLaterale = sezioniMenu(sezioniMenuIniziale, navigate, `about`, {}, 1);
  menuLaterale = sezioniMenu(sezioniMenuIniziale, navigate, `points`, { email: user.email }, 2);


  const [open, setOpen] = useState(false); // Controlla la visibilità del messaggio
  const [errors, setErrors] = useState('Si è verificato un errore! Controlla i dettagli.')
  const [testo, setTesto] = useState('');
  const [testoLog, setTestoLog] = useState([] as string[]);
  //const [testoLog, setTestoLog] = useState('[\"Punto uno\", \"Punto due\", \"Punto tre\"]')

  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);

  useEffect(() => {

    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Pulisci il listener al dismount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Crea l'array dei pulsanti in base all'orientamento

  const padding = isVertical ? 5   :8;




  const getUser = (email: any): void => {

    findByEmail(email, () => showError(setOpen, setErrors)).then((response: any) => {
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
  const getLogAttivita = (email: any): void => {

    logActivityByEmail(email, () => showError(setOpen, setErrors)).then((response: any) => {
      if (response) {
        if (response.status === 'OK') {
          console.log("response", response)
          setTestoLog(response.testo)
        } else {
          setErrors(response.errors);
          setOpen(true);
        }
      }
    })
  }
  if (testo === '') {
    getUser(user.email);
    getLogAttivita(user);
  }


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





  const cardsData = [
    {
      _id: 'card1',
      text: [testo], title: "Points", img: lizard, pulsanti: [] // Puoi aggiungere pulsanti qui se necessario
    },
    {
      _id: 'card2',
      text: testoLog, title: "Log Activity", img: points, pulsanti: [] // Puoi aggiungere pulsanti qui se necessario
    }
  ];

  return (
    <>
      <div>
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid item>
            <Drawer sezioni={menuLaterale} nameMenu="Menu" anchor="left" />
          </Grid>
        </Grid>
        <Box sx={{ paddingLeft: padding, paddingRight: 5, marginTop: 4 }}>
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
            <div id="cardData">
              <CardGrid cardsData={cardsData} />
            </div>

          </Box>
        </Box>
      </div>
    </>
  );

}


// Componente che visualizza il testo dallo store


export default PointsContent;
