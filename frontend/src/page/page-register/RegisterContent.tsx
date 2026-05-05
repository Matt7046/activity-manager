"use client";
import { Trans, useLingui } from "@lingui/react";
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, Divider, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { usePathname, useRouter } from 'next/navigation';
import React, { ChangeEvent, useState } from "react";

import { useUser } from '@/context/UserContext';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { AlertConfig } from '../../components/ms-alert/Alert';
import Button, { Pulsante } from "../../components/ms-button/Button";
import { ButtonName, SectionName } from '../../general/structure/Constant';
import { navigateRouting, ResponseI, showMessage, UserI } from "../../general/structure/Utils";
import { saveUser } from '../page-user-point/service/UserPointService';
import "./RegisterContent.css";



interface RegisterContentProps {
  user: UserI;
  alertConfig: AlertConfig,
  isVertical: boolean;
}
export interface PointRegister {
  password: string;
  email: string;
}

const RegisterContent: React.FC<RegisterContentProps> = ({
  user,
  alertConfig,
  isVertical
}) => {
  const { setUser } = useUser(); //
  const pathname = usePathname();
  const { i18n } = useLingui();
  const router = useRouter(); // Ottieni la funzione di navigazione
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
    title: i18n._("nuovo_tutorato"),
    configDialogPulsante: { message: i18n._("vuoi_aggiungere_un_tutorato"), showDialog: true }
  };

  const pulsanteBlue: Pulsante = {
    icona: 'fas fa-solid fa-floppy-disk',
    funzione: () => salvaRecord(user), // Passi la funzione direttamente
    nome: 'blue',
    title: i18n._("salva"),
    configDialogPulsante: { message: i18n._("vuoi_registrarti"), showDialog: true }
  };


  const salvaRecord = (userData: any): Promise<any> => {
    //  const utente = { email: userData.email, type: userData.type }
    const arrayDiOggetti = emailFigli.map(pointRegister => (pointRegister.email));
    if (userData === undefined || userData === null) {
      userData = { email: email, emailFigli: email, emailUserCurrent: email, password: password }
    }
    setUser(null);
    return saveUser({ ...userData, password: password, emailFigli: arrayDiOggetti, pointFigli: emailFigli }, (message: any) => showMessage(alertConfig.setOpen, alertConfig.setMessage, message)).then((x: ResponseI) => {
      navigateRouting(router, SectionName.ROOT, { newLogin: true })
    })
  }
  const handleChangePoints = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setPoint(parseInt(event.target.value));
  }

  return (
    <>
      {/* Campi di registrazione principali */}
      <Box mb={3} className='box-register'>
        <Grid size={{ xs: 12, sm: 12 }}>
          <Box mb={3} className='testo-register'>

            <Typography variant="body2" color="text.secondary">
              <strong> <Trans id="register" /></strong>
            </Typography>
          </Box>

        </Grid>
        <TextField
          label={i18n._("email")}
          variant="outlined"
          fullWidth
          value={email}
          onChange={handleChangeEmail}
          disabled={user?.email !== undefined}
        />


        <Box mb={2} >
          <TextField
            id="password"
            label={i18n._("password")}
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handleChangePassword}
            fullWidth
            /* Corretto l'annidamento e le chiusure delle parentesi */
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }, // Chiude input
            }} // Chiude slotProps
          />
        </Box>




        {/* Divider */}
        <Box mb={2}>
          <Divider sx={{ flexGrow: 1 }} />
          <Typography variant="body2" color="textSecondary">
            <strong><Trans id="email_figli" /></strong>
          </Typography>
          <Divider sx={{ flexGrow: 1 }} />

          {/* Email dei figli */}
          <Box>
            {emailFigli.map((emailFiglio, index) => (
              <Box className="box-child" key={index} mb={2}>
                <Grid container spacing={2} alignItems="center">
                  {/* Email del figlio */}
                  <Grid size={{ xs: 9 }}>
                    <TextField
                      label={`Email Figlio ${index + 1}`}
                      variant="outlined"
                      fullWidth
                      value={emailFiglio.email}
                      onChange={(e) => handleChangeEmailRegister(index, e.target.value)}
                      /* In MUI v6 usiamo slotProps invece di InputProps */
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <IconButton
                                aria-label={i18n._("remove")}
                                onClick={() => toggleIcon(index)}
                                onMouseDown={handleMouseDownPassword}
                                onMouseUp={handleMouseUpPassword}
                                edge="start" // Cambiato in start perché è uno startAdornment
                              >
                                <RemoveIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }, // Chiude input
                      }} // Chiude slotProps
                    />

                  </Grid>
                  {/* Points del figlio (fisso 100) */}
                  <Grid size={{ xs: 3 }}>
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
        </Box>

        {/* Pulsanti */}
        < Grid container justifyContent="flex-end" spacing={2} className="button-right" >
          <Button pulsanti={[pulsanteNew]} />
          <Button pulsanti={[pulsanteBlue]} />
        </Grid >
      </Box>
    </>
  );
}
export default RegisterContent;
