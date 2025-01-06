import AddIcon from '@mui/icons-material/Add';
import { Box, Button as ButtonMui } from "@mui/material";
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { navigateRouting, showMessage, useUser } from "../../App";
import Button, { Pulsante } from "../../components/msbutton/Button";
import { UserI } from "../../general/Utils";
import { TypeMessage } from "../page-layout/PageLayout";
import "./Register.css";
import { saveUserByPoints } from './service/RegisterService';



interface RegisterContentProps {
  user: UserI;
  setMessage: React.Dispatch<React.SetStateAction<TypeMessage>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTitle: (title: string) => void;

}

const RegisterContent: React.FC<RegisterContentProps> = ({
  user,
  setMessage,
  setOpen,
  setTitle,
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

  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
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

  useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
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
    const arrayDiOggetti = emailFigli.map(email => ({ email }));
    setUser(null);
    return saveUserByPoints({ ...userData, emailFigli: emailFigli, points: arrayDiOggetti }, (message: any) => showMessage(setOpen, setMessage, message)).then((x) => {
      console.log('User Data:', x); // Logga i dati utente per il debug     
      setTitle(''); 
      navigateRouting(navigate, ``, { newLogin : true })
    })
  }
  return (
    <>
      <div className="row">
        <Box sx={{ padding: 2 }}>
          <div>
            <div id="text-box-email" style={{ marginTop: '16px' }}>
              <TextField
                id="email"
                label={labelRegister.email}
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
            {emailFigli.map((email, index) => (
              <div key={index} style={{ marginBottom: "16px" }}>
                <TextField
                  id={`emailRegister-${index}`}
                  label={`Email ${index + 1}`}
                  variant="standard"
                  value={email} // Collega il valore allo stato
                  onChange={(e) => handleChangeEmailRegister(index, e.target.value)} // Aggiorna lo stato quando cambia
                  fullWidth
                />
              </div>
            ))}

            <ButtonMui
              variant="contained"
              color="primary"
              onClick={addField}
              style={{
                marginTop: '10px',
                width: '40px', // Imposta una larghezza fissa più piccola
                height: '40px', // Mantieni l'altezza invariata
                minWidth: 'unset', // Impedisce al pulsante di espandersi oltre la larghezza definita
              }}
            >
              <AddIcon />
            </ButtonMui>
          </div>
        </Box>
        {/* Pulsanti */}
        <Grid container justifyContent="flex-end" spacing={2}>
          <Button pulsanti={[pulsanteBlue]} />
        </Grid>
      </div>
    </>
  );
}
export default RegisterContent;
