import { Box, Grid } from "@mui/material";
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { navigateRouting, showMessage } from "../../App";
import Button, { Pulsante } from "../../components/msbutton/Button";
import { HttpStatus, UserI } from "../../general/Utils";
import { ActivityI } from "../page-activity/Activity";
import activityStore from "../page-activity/store/ActivityStore";
import { TypeMessage } from "../page-layout/PageLayout";
import "./Family.css";
import { deleteFamilyById, saveFamilyById } from "./service/FamilyService";

interface FamilyContentProps {
  user: UserI;
  setMessage: React.Dispatch<React.SetStateAction<TypeMessage>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FamilyContent: React.FC<FamilyContentProps> = ({
  user,
  setMessage,
  setOpen
}) => {

  const location = useLocation();
  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  const { _id } = location.state || {}; // Ottieni il valore dallo stato

  let testoOld = activityStore.testo.find((x) => _id === x._id);
  const activity: ActivityI = {
    _id: undefined,
    nome: "Attività",
    subTesto: "Descrizione"
  }

  testoOld = activity;
  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
  const [nome, setNome] = useState(activityStore.testo.find((x) => _id === x._id)?.nome);
  const [points, setPoints] = useState(activityStore.testo.find((x) => _id === x._id)?.points);
  const [subTesto, setSubTesto] = useState(activityStore.testo.find((x) => _id === x._id)?.subTesto);

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
    funzione: () => salvaRecord(_id), // Passi la funzione direttamente
    nome: 'blue',
    title: 'Salva',
    configDialogPulsante: { message: 'Vuoi salvare il record?', showDialog: true }

  };

  const handleChangeNome = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNome(event.target.value); // Aggiorna lo stato con il valore inserito
  };

  const handleChangePoints = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPoints(parseInt(event.target.value)); // Aggiorna lo stato con il valore inserito
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

    deleteFamilyById(_id, (message?: TypeMessage) => showMessage(setOpen, setMessage, message)).then((response) => {
      if (response) {
        if (response.status === HttpStatus.OK) {
          navigateRouting(navigate, 'activity', {})
        }
      }
    })
  }

  const salvaRecord = (_id: string): void => {

    const testo = {
      _id: _id,
      nome: nome,
      subTesto: subTesto,
      points: points,
    }
    saveFamilyById(_id, testo, (message?: TypeMessage) => showMessage(setOpen, setMessage, message)).then((response) => {
      if (response?.testo) {
        navigateRouting(navigate, 'activity', {})
      }
    })
  }

  return (
    <>
      <div className="row">
        <Box sx={{ padding: 2 }}>

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
          <div id="text-box">
            <TextField
              id="points"
              label={'Points'}
              variant="standard"
              value={points} // Collega il valore allo stato
              onChange={handleChangePoints} // Aggiorna lo stato quando cambia
              fullWidth
              type="number"
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

export default FamilyContent;
