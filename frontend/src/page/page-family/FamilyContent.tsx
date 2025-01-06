import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, FormControl, IconButton, Input, InputAdornment, InputLabel } from "@mui/material";
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from "react";
import { showMessage } from "../../App";
import Button, { Pulsante } from "../../components/msbutton/Button";
import { FormErrorValues, HttpStatus, ResponseI, UserI, verifyForm } from "../../general/Utils";
import { TypeMessage } from "../page-layout/PageLayout";
import { findByEmail } from "../page-points/service/PointsService";
import "./Family.css";
import { savePointsByFamily } from './service/FamilyService';
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

  // Stato per i valori dei campi
  type FormValues = {
    [key: string]: number | undefined;
  };
  const [disableButtonSave, setDisableButtonSave] = useState(true);
  const [formValues, setFormValues] = useState<FormValues>({
    newPoints: 0,
  });

  const [formErrors, setFormErrors] = useState<FormErrorValues>({
    newPoints: true,
  });
  const labelFamily = {
    email: "Email",
    //emailFamily: "Email",
    points: "Points",
    newPoints: "Aggiungi points"
  }

  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
  //const [newPoints, setNewPoints] = useState<number>(100);
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
          const errors: FormErrorValues = verifyForm(formValues);
          setDisableButtonSave(Object.keys(errors).filter((key) => errors[key] === true).length > 0)
          setIsLoading(false);
          familyStore.setPoints(response.testo.points); // Update the state with the new value
        }
      }
    })


    // Pulisci il listener al dismount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const errors: FormErrorValues = verifyForm(formValues);
    setDisableButtonSave(Object.keys(errors).filter((key) => errors[key] === true).length > 0)
    // Puoi aggiungere altre azioni da eseguire quando formValues cambia
  }, [formValues]); // Dipendenza su formValues


  const pulsanteBlue: Pulsante = {
    icona: 'fas fa-solid fa-floppy-disk',
    funzione: () => salvaRecord(user), // Passi la funzione direttamente
    nome: 'blue',
    disableButton: disableButtonSave,
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
    setFormValues({ ...formValues, newPoints: parseInt(event.target.value) })
  };

  const handleClose = () => {
    setOpen(false);
  };

  const salvaRecord = (userData: any): Promise<any> => {
    //  const utente = { email: userData.email, type: userData.type }
    const pointsWithPlus = isPlusIcon ? formValues.newPoints : - formValues.newPoints!;
    return savePointsByFamily({ ...userData, usePoints: pointsWithPlus }, (message: any) => showMessage(setOpen, setMessage, message)).then((x) => {
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
            <Grid size={{ xs: 12 }}>
              <TextField
                id="emailFamily"
                label={labelFamily.email}
                variant="standard"
                value={user.email} // Collega il valore allo stato
                onChange={handleChangeEmailFamily} // Aggiorna lo stato quando cambia
                fullWidth
                disabled={true}
              />
            </Grid>

      
            
            {/* Campo Points */}
            <Grid size={{ xs: 12, sm: 6 }}>
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
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth variant="standard">
                <InputLabel htmlFor="filled-adornment-new-points">New Points</InputLabel>
                <Input
                  id="filled-adornment-new-points"
                  value={formValues.newPoints} // Collega il valore allo stato
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
            <Button pulsanti={[pulsanteBlue]} />
          </Grid>
        </Box>
      </div>
    </>
  );

}

export default FamilyContent;
