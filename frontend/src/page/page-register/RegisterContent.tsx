import RemoveIcon from '@mui/icons-material/Remove';
import { Box, Divider, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import React, { ChangeEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useUser } from '../../App';
import { AlertConfig } from '../../components/ms-alert/Alert';
import Button, { Pulsante } from "../../components/ms-button/Button";
import { ButtonName, SectionName } from '../../general/structure/Constant';
import { ResponseI, UserI } from "../../general/structure/Utils";
import { navigateRouting, showMessage } from "../page-home/HomeContent";
import { saveUser } from '../page-user-point/service/UserPointService';
import "./RegisterContent.css";



interface RegisterContentProps {
  user: UserI;
  alertConfig: AlertConfig,
  setTitle: (title: string) => void;
  isVertical: boolean;

}


export interface PointRegister {
  password: string;
  email: string;
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
    points: "Punti"
  }
  const [isRemoveIcon, setIsRemoveIcon] = useState(true);
  const [point, setPoint] = useState<number>(100);
  const [email, setEmail] = useState<string>(user?.emailUserCurrent);
  const [password, setPassword] = useState<string>('');
  const [emailFigli, setEmailFigli] = useState<PointRegister[]>([{ email: 'child@simulated.com', password: 'password' }]);
  const [showPassword, setShowPassword] = useState(false);

  // Funzione per gestire il cambio di valore
  const handleChangeEmailRegister = (index: number, value: string) => {
    const updatedEmails = [...emailFigli];
    updatedEmails[index].email = value;
    setEmailFigli(updatedEmails);
  };

  const handleChangePasswordRegister = (index: number, value: string) => {
    const updatedEmails = [...emailFigli];
    updatedEmails[index].password = value;
    setEmailFigli(updatedEmails);
  };

  const togglePasswordVisibility = (event: any): void => {
    setShowPassword((prev) => !prev);

  }


  // Funzione per aggiungere un nuovo campo
  const handleAddEmailField = () => {
    setEmailFigli([...emailFigli, { email: '', password: '' }]); // Aggiungi un nuovo elemento vuoto
  };

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
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


  const salvaRecord = (userData: any): Promise<any> => {
    //  const utente = { email: userData.email, type: userData.type }
    const arrayDiOggetti = emailFigli.map(pointRegister => (pointRegister.email));
    if (userData === undefined || userData === null) {
      userData = { email: email, emailFigli: email, emailUserCurrent: email, password: password }
    }
    setUser(null);
    return saveUser({ ...userData, emailFigli: arrayDiOggetti, pointFigli: emailFigli }, (message: any) => showMessage(alertConfig.setOpen, alertConfig.setMessage, message)).then((x: ResponseI) => {
      navigateRouting(navigate, SectionName.ROOT, { newLogin: true })
    })
  }
  const handleChangePoints = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setPoint(parseInt(event.target.value));
  }

  return (
    <>
      {/* Campi di registrazione principali */}
      <Box mb={3} className='box-register'>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={handleChangeEmail}
          disabled={user?.email !== undefined}
        />
      </Box>

      <Box mb={2} >
        <TextField
          id="password"
          label="Password"
          variant="outlined"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={handleChangePassword}
          fullWidth
          InputProps={{
            endAdornment: (
              <IconButton onClick={togglePasswordVisibility}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />
      </Box>




      {/* Divider */}
      <Box display="flex" alignItems="center" mb={2}>
        <Divider sx={{ flexGrow: 1 }} />
        <Typography sx={{ mx: 2 }} variant="body2" color="textSecondary">
          Email Figli
        </Typography>
        <Divider sx={{ flexGrow: 1 }} />
      </Box>

      {/* Email dei figli */}
      <Box>
        {emailFigli.map((emailFiglio, index) => (
          <Box className="box-child" key={index} mb={2}>
            <Grid container spacing={2} alignItems="center">
              {/* Email del figlio */}
              <Grid xs={4}>
                <TextField
                  label={`Email Figlio ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  value={emailFiglio.email}
                  onChange={(e) => handleChangeEmailRegister(index, e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton
                          aria-label="Remove"
                          onClick={() => toggleIcon(index)}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                          edge="end"
                        >
                          <RemoveIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              {/* Points del figlio (fisso 100) */}
              <Grid xs= {2 }>
                <TextField
                  label={labelRegister.points}
                  value={100}
                  disabled
                  type="number"
                  variant="outlined" // uguale agli altri
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
        ))}
      </Box >

      {/* Pulsanti */}
      < Grid container justifyContent="flex-end" spacing={2} className="button-right" >
        <Button pulsanti={[pulsanteNew]} />
        <Button pulsanti={[pulsanteBlue]} />
      </Grid >
    </>
  );
}
export default RegisterContent;
