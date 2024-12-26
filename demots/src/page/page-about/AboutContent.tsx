import React, { useEffect, useState } from "react";
import "./About.css";
import { useLocation, useNavigate } from "react-router-dom";
import activityStore from "../page-activity/store/ActivityStore";
import { navigateRouting, showError } from "../../App";
import TextField from '@mui/material/TextField';
import { Alert, Box, Grid, Snackbar } from "@mui/material";
import { deleteAboutById, saveAboutById } from "./service/AboutService";
import Button, { Pulsante } from "../../components/msbutton/Button";
import Drawer from "../../components/msdrawer/Drawer";
import { ActivityI } from "../page-activity/Activity";
import { getMenuLaterale, UserI } from "../../general/Utils";

interface AboutContentProps {
  user: UserI;
  setErrors: any;
}

const AboutContent: React.FC<AboutContentProps> = ({
  user,
  setErrors
}) => {

  const location = useLocation();
  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  const { _id } = location.state || {}; // Ottieni il valore dallo stato
  const menuLaterale = getMenuLaterale(navigate, user);

  let testoOld = activityStore.testo.find((x) => _id === x._id);
  const activity: ActivityI = {
    _id: undefined,
    nome: "Attività",
    subTesto: "Descrizione"
  }

  testoOld = activity;
  const [open, setOpen] = useState(false);
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
      </div>
    </>
  );
}

export default AboutContent;
