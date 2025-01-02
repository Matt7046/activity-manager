import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel } from "@mui/material";
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from "react";
import { showMessage } from "../../App";
import Button, { Pulsante } from "../../components/msbutton/Button";
import { HttpStatus, ResponseI, UserI } from "../../general/Utils";
import { TypeMessage } from "../page-layout/PageLayout";
import { findByEmail, savePointsByTypeStandard } from "../page-points/service/PointsService";
import "./Family.css";
import familyStore from './store/FamilyStore';


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
  const labelFamily = {
    email: "Email  tutore",
    emailFamily: "Email figlio",
    points: "Points",
    newPoints: "Aggiungi points"
  }

  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
  const [newPoints, setNewPoints] = useState<number>(100);
 // const [points, setPoints] = useState<number>(0);
  const [isPlusIcon, setIsPlusIcon] = useState(true);
  const [isLoading, setIsLoading] = useState(true);


  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const toggleIcon = () => {
    setIsPlusIcon((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    const emailFind = user.emailFamily ? user.emailFamily : user.email;

    findByEmail({ ...user, email: emailFind }, (message: any) => showMessage(setOpen, setMessage, message)).then((response: ResponseI) => {
      if (response) {
        if (response.status === HttpStatus.OK) {
          setIsLoading(false);
          familyStore.setPoints(response.testo.points); // Update the state with the new value
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
   familyStore.setPoints(parseInt(event.target.value)); // Update the state with the new value
  };

  const handleChangeNewPoints = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPoints(parseInt(event.target.value)); // Aggiorna lo stato con il valore inserito
  };

  const handleClose = () => {
    setOpen(false);
  };

  const salvaRecord = (userData: any): Promise<any> => {
    //  const utente = { email: userData.email, type: userData.type }
    const pointsWithPlus = isPlusIcon ? newPoints : - newPoints;
    return savePointsByTypeStandard({ ...userData,  usePoints: pointsWithPlus }, (message: any) => showMessage(setOpen, setMessage, message)).then((x) => {
      console.log('User Data:', x); // Logga i dati utente per il debug
     // setPoints(x.testo.points)
     familyStore.setPoints(parseInt(x?.testo.points)); // Update the state with the new value
   

      // navigateRouting(navigate, `activity`, {})
    })
  }

  if (isLoading) {
    return <p>Caricamento...</p>; // Mostra un loader mentre i dati vengono caricati
  }
  return (
    <>
      <div className="row">
        <Box sx={{ padding: 2 }}>
          <Grid container spacing={2}>
            {/* Campo emailFamily */}
            <Grid item xs={12}>
              <TextField
                id="emailFamily"
                label={labelFamily.emailFamily}
                variant="standard"
                value={user.emailFamily} // Collega il valore allo stato
                onChange={handleChangeEmailFamily} // Aggiorna lo stato quando cambia
                fullWidth
                disabled={true}
              />
            </Grid>
  
            {/* Campo email */}
            <Grid item xs={12}>
              <TextField
                id="email"
                label={labelFamily.email}
                variant="standard"
                value={user.email} // Collega il valore allo stato
                onChange={handleChangeEmail} // Aggiorna lo stato quando cambia
                fullWidth
                disabled={true}
                multiline
                InputLabelProps={{
                  style: {
                    whiteSpace: 'normal', // Permette al testo di andare a capo
                    wordWrap: 'break-word', // Interrompe le parole lunghe
                  },
                }}
              />
            </Grid>
  
            {/* Campo Points */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="standard">
                <InputLabel htmlFor="filled-points">{labelFamily.points}</InputLabel>
                <Input
                  id="filled-adornment-points"
                  value={familyStore.getStore().points} // Collega il valore allo stato
                  onChange={handleChangePoints} // Aggiorna lo stato quando cambia
                  disabled={true}
                />
              </FormControl>
            </Grid>
  
            {/* Campo New Points */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="standard">
                <InputLabel htmlFor="filled-adornment-new-points">New Points</InputLabel>
                <Input
                  id="filled-adornment-new-points"
                  value={newPoints} // Collega il valore allo stato
                  onChange={handleChangeNewPoints} // Aggiorna lo stato quando cambia
                  type={'number'}
                  startAdornment={
                    <InputAdornment position="start">
                      <IconButton
                        aria-label={'Add points'}
                        onClick={toggleIcon}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {isPlusIcon ? <AddIcon /> : <RemoveIcon />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
          </Grid>
  
          {/* Pulsanti */}
          <Grid container justifyContent="flex-end" spacing={2} sx={{ marginTop: 2 }}>
            <Grid item>
              <Button pulsanti={[pulsanteBlue]} />
            </Grid>
          </Grid>
        </Box>
      </div>
    </>
  );
  
}

export default FamilyContent;
