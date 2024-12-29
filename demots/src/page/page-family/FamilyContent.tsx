import { Box, Grid } from "@mui/material";
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showMessage } from "../../App";
import Button, { Pulsante } from "../../components/msbutton/Button";
import { HttpStatus, ResponseI, UserI } from "../../general/Utils";
import { TypeMessage } from "../page-layout/PageLayout";
import { findByEmail, savePointsByTypeStandard } from "../page-points/service/PointsService";
import "./Family.css";

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
  const labelFamily = {
    email: "Email  figlio",
    emailFamily: "Email tutore",
    points: "Points",
    newPoints: "Aggiungi points"
  }

  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
  const [newPoints, setNewPoints] = useState<number>(100);
  const [points, setPoints] = useState<number>(0);



  useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    findByEmail(user, (message: any) => showMessage(setOpen, setMessage, message)).then((response: ResponseI) => {
      if (response) {
        if (response.status === HttpStatus.OK) {
          setPoints(response.testo.points);
          console.log('Dati ricevuti:', response);
        }
      }
    })

    // Pulisci il listener al dismount
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const pulsanteBlue: Pulsante = {
    icona: 'fas fa-solid fa-floppy-disk',
    funzione: () => salvaRecord(user), // Passi la funzione direttamente
    nome: 'blue',
    title: 'Salva',
    configDialogPulsante: { message: 'Vuoi salvare il record?', showDialog: true }
  };

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
  };

  const handleChangeEmailFamily = (event: React.ChangeEvent<HTMLInputElement>) => {
  };


  const handleChangePoints = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPoints(parseInt(event.target.value)); // Aggiorna lo stato con il valore inserito
  };

  const handleChangeNewPoints = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPoints(parseInt(event.target.value)); // Aggiorna lo stato con il valore inserito
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
  
  const salvaRecord = (userData: any): Promise<any> => {
    //  const utente = { email: userData.email, type: userData.type }
    return savePointsByTypeStandard({...userData, points: points, usePoints: newPoints}, (message: any) => showMessage(setOpen, setMessage, message)).then((x) => {
      console.log('User Data:', x); // Logga i dati utente per il debug
      setPoints(x.testo.points)
     // navigateRouting(navigate, `activity`, {})
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
            rows={10} // Numero di righe visibili per il campo
            InputLabelProps={{
              style: {
                whiteSpace: 'normal', // Permette al testo di andare a capo
                wordWrap: 'break-word', // Interrompe le parole lunghe
              },
            }}
          />
        </div>
        <div id="text-box-points">
          <TextField
            id="points"
            label={labelFamily.points}
            variant="standard"
            value={points} // Collega il valore allo stato
            onChange={handleChangePoints} // Aggiorna lo stato quando cambia
            fullWidth
            disabled={true}
            type="number"
          />
        </div>
        <div id="text-box-use-points">
          <TextField
            id="UsePoints"
            label={labelFamily.newPoints}
            variant="standard"
            value={newPoints} // Collega il valore allo stato
            onChange={handleChangeNewPoints} // Aggiorna lo stato quando cambia
            fullWidth
            type="number"
          />
        </div>
      </Box>
      {/* Pulsanti */}
      <Grid container justifyContent="flex-end" spacing={2}>
        <Grid item>
          <Button pulsanti={[pulsanteBlue]} />
        </Grid>
      </Grid>
    </div>
  </>
);
}

export default FamilyContent;
