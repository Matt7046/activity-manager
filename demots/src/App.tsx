import '@fortawesome/fontawesome-free/css/all.min.css';
import { Button as ButtonMui, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { GoogleLogin, GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import React, { useState } from 'react';
import { NavigateFunction, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Alert from './components/msallert/Alert';
import { MenuLaterale } from './components/msdrawer/Drawer';
import { TypeUser, UserI } from './general/Utils';
import About from './page/page-about/About';
import Activity from './page/page-activity/Activity';
import Family from './page/page-family/Family';
import { TypeMessage } from './page/page-layout/PageLayout';
import Operative from './page/page-operative/Operative';
import Points from './page/page-points/Points';
import { savePoints as getUser } from './page/page-points/service/PointsService';
import Register from './page/page-register/Register';
import { getEmailChild } from './page/page-register/service/RegisterService';



// Componente principale, avvolto da GoogleOAuthProvider
const App = () => (
  <GoogleOAuthProvider clientId="549622774155-atv0j0qj40r1vpl1heibaughtf0t2lon.apps.googleusercontent.com">
    <GoogleAuthComponent />
  </GoogleOAuthProvider>
);

// Componente di autenticazione
const GoogleAuthComponent = () => {
  const navigate = useNavigate();  // Qui chiami useNavigate correttamente all'interno di un componente
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false); // Controlla la visibilità del messaggio
  const [loading, setLoading] = useState(false);
  const [simulated, setSimulated] = useState(0);
  const [title, setTitle] = useState("");
  const [openD, setOpenD] = useState(false); // Stato per la dialog
  const [email, setEmail] = useState('child@simulated.com'); // Stato per l'email
  const [message, setMessage] = React.useState<TypeMessage>({}); // Lo stato è un array di stringhe
  const [emailOptions, setEmailOptions] = React.useState<string[]>([]); // Lo stato è un array di stringhe
  const [emailLogin, setEmailLogin] = useState(); // Stato per l'email



  const [userData, setUserData] = useState({
    name: "Simulated User",
    emailFamily: "user@simulated.com",
    email: "user@simulated.com",
    token: null,
    type: -1
  }); // Stato per userData

  const [userDataChild, setUserDataChild] = useState({
    name: "Simulated child User",
    emailFamily: "child@simulated.com",
    email: "user@simulated.com",
    token: null,
    type: -1
  }); // Stato per userData

  const handleConfirm = ((typeSimulated: number, emailGoogle?: string) => {
    console.log("Email confermata:", emailGoogle);
    const emailEnter = emailGoogle ? emailGoogle : typeSimulated ? 'simulated@simulated.com' : 'child@simulated.com';
    userData.emailFamily = email;
    userData.email = emailEnter;
    userData.type = typeSimulated;
    setUser(userData);
    navigateRouting(navigate, `activity`, {});

    //saveUserData(userData, setLoading);
  });

  // Funzione di logout
  const logOut = () => {
    setUser(null); // Resetta il profilo utente
  };
  const handleClose = () => {
    setOpen(false);
  };




  // Funzioni di gestione
  const handleOpenD = () => setOpenD(true);
  const handleCloseD = () => setOpenD(false);
  const handleEmailChange = (event: SelectChangeEvent) => {
    setEmail(event.target.value);
  };


  // Configura useGoogleLogin
  const login = useGoogleLogin({
    onSuccess: (codeResponse: any) => {
      console.log('Login Success:', codeResponse);

      const accessToken = codeResponse?.access_token;
      // Puoi usare l'access token per fare richieste all'API di Google
      fetchUserData(accessToken);
    },
    onError: (error) => {
      console.error('Login Failed:', error);
    },
  });



  const handleLoginSuccessFake = (fakeResponse: any, type: number) => {
    const userType = type === 0 ? { ...userDataChild } : { ...userData }
    const user = {
      ...userType,
      token: fakeResponse.credential,
      type: type
    };
    setUserData(user);
    getEmailChild(user).then((x: any) => {
      const emailChild = x?.testo ?? [];
      setEmailOptions(emailChild);
    })
    //  

    console.log("Login simulato effettuato:", fakeResponse);
    showDialog(type, false);

  };

  const showDialog = (type: number, googleAuth: boolean, userDataGoogle?: any): void => {
    const userType = userDataGoogle ? {...userDataGoogle, emailFamily: userDataGoogle.email} : type === 0 ? { ...userDataChild } : { ...userData }
    openHome({ ...userType, type: type }, googleAuth, setLoading)

  }




  const openHome = (userD: any, googleAuth: boolean, setLoading: any): Promise<any> => {
    //  const utente = { email: userData.email, type: userData.type }
    return getUser(userD, () => showMessage(setOpen, setMessage), setLoading).then((x) => {
      console.log('User Data:', x); // Logga i dati utente per il debug


      switch (x?.testo?.typeUser) {
        case 0: {          
          setSimulated(TypeUser.STANDARD);
          setUser({ ...userD, type: x.testo.typeUser });
          navigateRouting(navigate, `activity`, {});
          break;
        }
        case 1: {
          setSimulated(TypeUser.FAMILY);
          //  setUserData({ ...userD, email, type: x.testo.typeUser })
          handleOpenD();
          break;
        }
        case 2: {
          if (googleAuth === true) {
            setUser({ ...userD, type: x.testo.typeUser });

          }
          else {
            setUser({ ...userData, type: x.testo.typeUser });
          }
          navigateRouting(navigate, `register`, {})
        }
          break;
      }
    })
  }



  // Funzione per ottenere i dati utente
  const fetchUserData = async (accessToken: string) => {
    try {
      // Verifica che il token sia valido
      const tokenInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`);
      const tokenInfo = await tokenInfoResponse.json();
      if (tokenInfo.error) {
        console.error('Token invalido:', tokenInfo.error);
        return;
      }
      // Se il token è valido, recupera i dati dell'utente
      const userDataResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (userDataResponse.ok) {
        const userDataGoogle = await userDataResponse.json();
        setEmailLogin(userDataGoogle.email);
        getEmailChild(userDataGoogle).then((x: any) => {
          const emailChild = x?.testo ?? [];
          setEmailOptions(emailChild);
        })
        //setUser({ ...userData, type: 1 });
        setUserData(userDataGoogle);
        showDialog(1, true, userDataGoogle);
      } else {
        console.error('Failed to fetch user data:', userDataResponse.status);
      }
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  }

  // Simulazione del login con Google
  const simulateLogin = (type: number) => {
    setSimulated(type);
    const fakeResponse = {
      credential: "fake-token-id",
      clientId: "549622774155-atv0j0qj40r1vpl1heibaughtf0t2lon.apps.googleusercontent.com",
      select_by: "google",
    };
    handleLoginSuccessFake(fakeResponse, type);
  };

  return (
    <>
     {open && (
        <Alert onClose={handleClose} message={message} />
      )}

      {/* Google OAuth Provider */}
      <GoogleOAuthProvider clientId="549622774155-atv0j0qj40r1vpl1heibaughtf0t2lon.apps.googleusercontent.com">
        <div>
          <h1>Login con Google ({user ? user.name : "Non autenticato"})</h1>

          {!user ? (
            <div>
              <div
                className="col-button-container"
                style={{
                  gridColumn: 'span 2',
                  display: 'flex',
                  gridTemplateColumns: '2fr 1fr',
                  gap: '12px',
                }}
              >

                <div>
                  <Grid container spacing={2}>
                    {/* Prima riga: Pulsanti per simulare il login */}
                    <Grid item xs={12} sm={6}>
                      <ButtonMui
                        variant="contained"
                        color="primary"
                        onClick={() => simulateLogin(TypeUser.STANDARD)}
                        fullWidth
                      >
                        Simula login utente base
                      </ButtonMui>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <ButtonMui
                        variant="contained"
                        color="primary"
                        onClick={() => simulateLogin(TypeUser.FAMILY)}
                        fullWidth
                      >
                        Simula login controllo parentale
                      </ButtonMui>
                    </Grid>

                    {/* Seconda riga: Pulsante di login reale */}
                    <Grid item xs={12}>
                      <GoogleLogin onSuccess={() => login()} onError={logOut} />

                    </Grid>
                  </Grid>
                </div>
              </div>

              <div>


                {/* Dialog */}
                <Dialog open={openD} onClose={handleCloseD}>
                  <DialogTitle>Inserisci email del figlio </DialogTitle>
                  <DialogContent>
                    <InputLabel>Email</InputLabel>
                    <Select
                      value={email}
                      onChange={(event) => handleEmailChange(event)}
                      label="Email"
                      autoWidth
                    >
                      {emailOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </DialogContent>
                  <DialogActions>
                    <ButtonMui onClick={handleCloseD} color="secondary">
                      Annulla
                    </ButtonMui>
                    <ButtonMui
                      onClick={() => handleConfirm(simulated, emailLogin)}
                      color="primary"
                      disabled={!email} // Disabilita il pulsante se l'email è vuota
                    >
                      Conferma
                    </ButtonMui>
                  </DialogActions>
                </Dialog>
              </div>
            </div>
          ) : (
            <div>
              <h1>{title}</h1>
              <Routes>
                <Route path="/register" element={<Register user={user} />} />
                <Route path="/activity" element={<Activity user={user} />} />
                <Route path="/about" element={<About user={user} />} />
                <Route path="/points" element={<Points user={user} />} />
                <Route path="/operative" element={<Operative user={user} />} />
                <Route path="/family" element={<Family user={user} />} />
              </Routes>
            </div>
          )}
        </div>
      </GoogleOAuthProvider>

      {/* Mostra il loader se loading è true */}
      {loading && <CircularProgress />}
    </>
  );

};

export const navigateRouting = (navigate: NavigateFunction, path: string, params: any) => {
  navigate(`/${path}`, { state: params }); // Passa i parametri come stato
};

export const sezioniMenuIniziale = (user: UserI): MenuLaterale[][] => {
  if (user.type === TypeUser.FAMILY) {
    return [
      [
        { funzione: null, testo: 'Activity' },
        { funzione: null, testo: 'About' },
        { funzione: null, testo: 'Points' },
        { funzione: null, testo: 'Operative' },
      ],
      [
        { funzione: null, testo: 'Family' }
      ]
    ];
  } else {
    return [
      [
        { funzione: null, testo: 'Activity' },
        { funzione: null, testo: 'Points' },
        { funzione: null, testo: 'Operative' },
      ]
    ];
  }
}

export const showMessage = (setOpen: any, setMessage: any, message?: TypeMessage) => {
  const messageBE = message?.message ? { message: message?.message, typeMessage: message?.typeMessage } : { message:['Il server non risponde'], typeMessage: 'error' };
  setOpen(true);
  setMessage(messageBE);
}

export const sezioniMenu = (
  sezioni: MenuLaterale[][],
  navigate: NavigateFunction,
  path: string,
  params: any,
  indice: number
): MenuLaterale[][] => {

  // Calcola la posizione (riga e colonna) per assegnare la funzione
  const numeroRighe = sezioni.length;
  const lunghezzaRiga = sezioni[0].length;

  const riga = Math.floor(indice / lunghezzaRiga);
  const colonna = indice % lunghezzaRiga;

  // Verifica che riga e colonna siano validi e assegna la funzione dinamica
  if (riga < numeroRighe && colonna < sezioni[riga].length) {
    sezioni[riga][colonna].funzione = () => navigateRouting(navigate, path, params);
  }
  return sezioni;
};

export default App;
