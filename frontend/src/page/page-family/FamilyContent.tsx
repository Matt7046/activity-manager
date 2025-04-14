import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, FormControl, IconButton, Input, InputAdornment, InputLabel } from "@mui/material";
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from "react";
import { showMessage, useUser } from "../../App";
import Button, { Pulsante } from "../../components/ms-button/Button";
import { ButtonName, HttpStatus } from '../../general/Constant';
import { FormErrorValues, ResponseI, verifyForm } from "../../general/Utils";
import { TypeMessage } from "../page-layout/PageLayout";
import { findByEmail } from "../page-user-point/service/UserPointService";
import "./FamilyContent.css";
import { savePointsByFamily } from './service/FamilyService';
import familyStore from './store/FamilyStore';


interface FamilyContentProps {
  setMessage: React.Dispatch<React.SetStateAction<TypeMessage>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isVertical: boolean;
}

const FamilyContent: React.FC<FamilyContentProps> = ({
  setMessage,
  setOpen,
  isVertical
}) => {
  const { user, setUser } = useUser();
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

  const [isPlusIcon, setIsPlusIcon] = useState(true);
  const [inizialLoad, setInitialLoad] = useState<boolean>(true);



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
    const emailFind = user.emailFamily ? user.emailFamily : user.email;

    findByEmail({ ...user, email: emailFind }, (message: any) => showMessage(setOpen, setMessage, message)).then((response: ResponseI | undefined) => {
      if (response) {
        if (response.status === HttpStatus.OK) {
          const errors: FormErrorValues = verifyForm(formValues);
          setDisableButtonSave(Object.keys(errors).filter((key) => errors[key] === true).length > 0)
          familyStore.setPoints(response.jsonText.points); // Update the state with the new value
          familyStore.setEmail(user.email);
        }
      }
    })


    // Pulisci il listener al dismount
    return () => { };
  }, [inizialLoad]);

  useEffect(() => {
    const errors: FormErrorValues = verifyForm(formValues);
    setDisableButtonSave(Object.keys(errors).filter((key) => errors[key] === true).length > 0)
    // Puoi aggiungere altre azioni da eseguire quando formValues cambia
  }, [formValues]); // Dipendenza su formValues


  const pulsanteBlue: Pulsante = {
    icona: 'fas fa-solid fa-floppy-disk',
    funzione: () => salvaRecord(user), // Passi la funzione direttamente
    nome: ButtonName.BLUE,
    disableButton: disableButtonSave,
    title: 'Salva',
    configDialogPulsante: { message: 'Vuoi salvare il record?', showDialog: true }
  };

  const handleChangeEmailFamily = (event: React.ChangeEvent<HTMLInputElement>) => {
    familyStore.setEmail(event.target.value); // Updat
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
      familyStore.setPoints(parseInt(x?.jsonText.points)); // Update the state with the new value


      // navigateRouting(navigate, `activity`, {})
    })
  }
  return (
    <>
      <Box className='box-family'>
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
        <Grid container justifyContent="flex-end" spacing={2} className='button-right-bottom'>
          <Button pulsanti={[pulsanteBlue]} />
        </Grid>
      </Box>
    </>
  );

}

export default FamilyContent;
