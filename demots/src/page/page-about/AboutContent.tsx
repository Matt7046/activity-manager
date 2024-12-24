import React, { useEffect, useState } from "react";
import "./About.css";
import { useLocation, useNavigate } from "react-router-dom";
import activityStore from "../page-activity/store/ActivityStore";
import { navigateRouting, sezioniMenu, sezioniMenuIniziale, showError } from "../../App";
import TextField from '@mui/material/TextField';
import { Alert, Box, Grid, Snackbar } from "@mui/material";
import { deleteAboutById, saveAboutById } from "./service/AboutService";
import Button, { Pulsante } from "../../components/msbutton/Button";
import Drawer from "../../components/msdrawer/Drawer";
import { ActivityI } from "../page-activity/Activity";


interface AboutContentProps {
  user: any;
}

const AboutContent: React.FC<AboutContentProps> = ({
  user
}) => {

  const location = useLocation();
  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  const { _id } = location.state || {}; // Ottieni il valore dallo stato
  let menuLaterale = sezioniMenu(sezioniMenuIniziale, navigate, `activity`, {}, 0);
  menuLaterale = sezioniMenu(sezioniMenuIniziale, navigate, `about`, {}, 1);
  menuLaterale = sezioniMenu(sezioniMenuIniziale, navigate, `points`, { email: user.email }, 2);

  let testoOld = activityStore.testo.find((x) => _id === x._id);
  const activity : ActivityI = {
  _id: undefined,
  nome : "Attività",
  subTesto : "Descrizione"
  }

  testoOld = activity;
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState('Si è verificato un errore! Controlla i dettagli.')
  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
  const [nome, setNome] = useState(activityStore.testo.find((x) => _id === x._id)?.nome);
  const [subTesto, setSubTesto] = useState(activityStore.testo.find((x) => _id === x._id)?.subTesto);
  const padding = isVertical ? 5 : 8;

  const pulsanteRed: Pulsante = {
    icona: 'fas fa-solid fa-trash',
    funzione: () => cancellaRecord(_id), // Passi la funzione direttamente
    nome: 'red',
    title: 'Elimina',
    visibility: _id ? true : false
  };

  const pulsanteBlue: Pulsante = {
    icona: 'fas fa-solid fa-floppy-disk',
    funzione: () => salvaRecord(_id), // Passi la funzione direttamente
    nome: 'blue',
    title: 'Salva'
  };

  const handleChangeNome = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNome(event.target.value); // Aggiorna lo stato con il valore inserito
  };

  const handleChangeSubTesto = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubTesto(event.target.value); // Aggiorna lo stato con il valore inserito    
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {

    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Pulisci il listener al dismount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Crea l'array dei pulsanti in base all'orientamento

  const cancellaRecord = (_id: string): void => {

    deleteAboutById(_id, () => showError(setOpen, setErrors)).then((response) => {
      if (response) {
        if (response.status === 'OK') {
          navigateRouting(navigate, 'activity', {})
        } else {
          setErrors(response.errors);
          setOpen(true);
        }
      }
    })
  }

  const salvaRecord = (_id: string): void => {

    const testo = {
      _id: _id,
      nome: nome,
      subTesto: subTesto
    }
    saveAboutById(_id, testo, () => showError(setOpen, setErrors)).then((response) => {
      if (response?.testo) {
        navigateRouting(navigate, 'activity', {})
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
            <div id="text-box">
              <TextField
                id="nome"
                label={testoOld.nome}
                variant="standard"
                value={nome} // Collega il valore allo stato
                onChange={handleChangeNome} // Aggiorna lo stato quando cambia
                fullWidth
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
        </Box>
      </div>
    </>
  );
}

export default AboutContent;
