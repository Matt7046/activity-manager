import React, { useState } from "react";
import "./About.css";
import Label from "../AClabel/label";
import { NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import subPromiseStore from "../pageSubPromise/store/SubPromiseStore";
import { navigateRouting, sezioniMenu, sezioniMenuIniziale } from "../../App";
import TextField from '@mui/material/TextField';
import { Alert, Box, Grid, Hidden, Snackbar } from "@mui/material";
import { deleteAboutById, saveAboutById } from "./service/AboutService";
import { DTOSubPromise } from "../dto/DTOSubPromise";
import Button, { Pulsante } from "../ACButton/Button";
import Drawer, { MenuLaterale } from "../ACDrawer/Drawer";



const AboutContent: React.FC<any> = ({
}) => {



  const location = useLocation();
  const { _id } = location.state || {}; // Ottieni il valore dallo stato

  const navigate = useNavigate(); // Ottieni la funzione di navigazione

  let testoOld = subPromiseStore.testo.find((x) => _id === x._id);
  testoOld = testoOld ? testoOld : new DTOSubPromise();
  const [nome, setNome] = useState(subPromiseStore.testo.find((x) => _id === x._id)?.nome);

  const handleChangeNome = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNome(event.target.value); // Aggiorna lo stato con il valore inserito
  };

  const [subTesto, setSubTesto] = useState(subPromiseStore.testo.find((x) => _id === x._id)?.subTesto);

  const handleChangeSubTesto = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubTesto(event.target.value); // Aggiorna lo stato con il valore inserito
  };

  const [open, setOpen] = useState(false); // Controlla la visibilità del messaggio
  const [errors, setErrors] = useState('Si è verificato un errore! Controlla i dettagli.')



  const cancellaRecord = (_id: any): void => {

    deleteAboutById(_id).then((response) => {
      if (response.status === 'OK') {
        navigateRouting(navigate, '', {})
        console.log('Dati ricevuti:', response);
      } else {
        setErrors(response.errors);
        setOpen(true);
      }
    })
  }

  const handleClose = () => {
    setOpen(false);
  };




  const salvaRecord = (_id: string): void => {

    const testo = {
      _id: _id,
      nome: nome,
      subTesto: subTesto
    }
    saveAboutById(_id, testo).then((response) => {
      if (response.testo) {
        navigateRouting(navigate, '', {})
      }
    })
  }


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
  let menuLaterale = sezioniMenu(sezioniMenuIniziale, navigate, ``, {}, 0);
  menuLaterale = sezioniMenu(sezioniMenuIniziale, navigate, `about`, {}, 1);
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


// Componente che visualizza il testo dallo store


export default AboutContent;
