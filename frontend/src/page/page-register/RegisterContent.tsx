import RemoveIcon from '@mui/icons-material/Remove';
import { Box, IconButton, Input, InputAdornment } from "@mui/material";
import Grid from '@mui/material/Grid2';
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { navigateRouting, showMessage, useUser } from "../../App";
import { AlertConfig } from '../../components/ms-alert/Alert';
import Button, { Pulsante } from "../../components/ms-button/Button";
import { ButtonName, SectionName } from '../../general/structure/Constant';
import { ResponseI, UserI } from "../../general/structure/Utils";
import { saveUser } from '../page-user-point/service/UserPointService';
import "./RegisterContent.css";



interface RegisterContentProps {
  user: UserI;
  alertConfig:AlertConfig,
  setTitle: (title: string) => void;
  isVertical: boolean;

}

const RegisterContent: React.FC<RegisterContentProps> = ({
  user,
  alertConfig,
  setTitle,
  isVertical
}) => {
  const { setUser } = useUser(); //
  const location = useLocation();
  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  const { _id } = location.state || {}; // Ottieni il valore dallo stato
  const labelRegister = {
    email: "Email di registazione",
    emailFiglio: "Email Figlio",
    points: "Points"
  }
  const [isRemoveIcon, setIsRemoveIcon] = useState(true);
  const [emailFigli, setEmailFigli] = useState<string[]>(['child@simulated.com']);

  // Funzione per gestire il cambio di valore
  const handleChangeEmailRegister = (index: number, value: string) => {
    const updatedEmails = [...emailFigli];
    updatedEmails[index] = value;
    setEmailFigli(updatedEmails);
  };

  // Funzione per aggiungere un nuovo campo
  const handleAddEmailField = () => {
    setEmailFigli([...emailFigli, ""]); // Aggiungi un nuovo elemento vuoto
  };

  const addField = () => {
    handleAddEmailField();
  };


  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const toggleIcon = (indexToRemove: number) => {
    setEmailFigli(prevEmails => prevEmails.filter((_, i) => i !== indexToRemove));
  };

  const pulsanteNew: Pulsante = {
    icona: 'fas fa-plus',
    funzione: () => addField(),
    nome: ButtonName.NEW,
    title: 'Nuovo tutorato',
    configDialogPulsante: { message: 'Vuoi aggiungere un tutorato?', showDialog: true }
  };

  const pulsanteBlue: Pulsante = {
    icona: 'fas fa-solid fa-floppy-disk',
    funzione: () => salvaRecord(user), // Passi la funzione direttamente
    nome: 'blue',
    title: 'Salva',
    configDialogPulsante: { message: 'Vuoi registrarti?', showDialog: true }
  };

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
  };

  const salvaRecord = (userData: any): Promise<any> => {
    //  const utente = { email: userData.email, type: userData.type }
    const arrayDiOggetti = emailFigli.map(email => ({ email }));
    setUser(null);
    return saveUser({ ...userData, emailFigli: emailFigli, pointFigli: arrayDiOggetti }, (message: any) => showMessage(alertConfig.setOpen, alertConfig.setMessage, message)).then((x: ResponseI) => {
      navigateRouting(navigate, SectionName.ROOT, { newLogin: true })
    })
  }
  return (
    <>
      <Box>
        {emailFigli.map((email, index) => (
          <Box className= 'box-child'> 

            <><Input
              id="filled-adornment-new-points"
              fullWidth
              value={email} // Collega il valore allo stato
              onChange={(e) => handleChangeEmailRegister(index, e.target.value)} // Aggiorna lo stato quando cambia
              type={'string'}
              startAdornment={<InputAdornment position="start">
                <IconButton
                  aria-label={'Add points'}
                  onClick={(e) => toggleIcon(index)}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {<RemoveIcon />}
                </IconButton>
              </InputAdornment>} />
            </>
          </Box>
        ))}

      </Box>
      <Grid container justifyContent="flex-end" spacing={2} className='button-right'>

        <Button pulsanti={[pulsanteNew]} />
        <Button pulsanti={[pulsanteBlue]} />
      </Grid>
    </>
  );
}
export default RegisterContent;
