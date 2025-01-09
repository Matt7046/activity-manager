import '@fortawesome/fontawesome-free/css/all.min.css';
import { Button as ButtonMui, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { GoogleLogin, GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { NavigateFunction, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import Alert from './components/ms-alert/Alert';
import { MenuLaterale } from './components/ms-drawer/Drawer';
import { getToken } from './general/service/AuthService';
import { TypeUser, UserI } from './general/Utils';
import About from './page/page-about/About';
import Activity from './page/page-activity/Activity';
import activityStore from './page/page-activity/store/ActivityStore';
import Family from './page/page-family/Family';
import familyStore from './page/page-family/store/FamilyStore';
import { TypeMessage } from './page/page-layout/PageLayout';
import Operative from './page/page-operative/Operative';
import operativeStore from './page/page-operative/store/OperativeStore';
import Points from './page/page-points/Points';
import { getUserType as getTypeUser } from './page/page-points/service/PointsService';
import pointsStore from './page/page-points/store/PointsStore';
import Register from './page/page-register/Register';
import { getEmailChild } from './page/page-register/service/RegisterService';
import registerStore from './page/page-register/store/RegisterStore';


// Creazione del contesto per User
const UserContext = createContext<any>(null);

// Hook per accedere al contesto
export const useUser = () => useContext(UserContext);

// Componente UserProvider che gestisce lo stato di `user`
interface UserProviderProps {
  children: ReactNode; // Aggiungi la prop `children` di tipo ReactNode
}

// Provider del contesto
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null); // Stato utente
  const location = useLocation(); // Per monitorare la posizione corrente

  // Funzione per distruggere l'utente
  const resetUser = () => setUser(null);

  useEffect(() => {
    // Se la posizione è la pagina di login, distruggi il contesto
    if (location.pathname === '/') {
      resetUser();
    }
    return () => {
    };
  }, [location]);

  return (
    <UserContext.Provider value={{ user, setUser, resetUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Componente principale, avvolto da GoogleOAuthProvider
const App = () => (
  <GoogleOAuthProvider clientId="549622774155-atv0j0qj40r1vpl1heibaughtf0t2lon.apps.googleusercontent.com">
    <UserProvider>
      <GoogleAuthComponent />
    </UserProvider>
  </GoogleOAuthProvider>
);

// Componente di autenticazione
const GoogleAuthComponent = () => {
  const navigate = useNavigate();  // Qui chiami useNavigate correttamente all'interno di un componente


  const { user, setUser } = useUser();
  const [open, setOpen] = useState(false); // Controlla la visibilità del messaggio
  const [loading, setLoading] = useState(false);
  const [simulated, setSimulated] = useState(0);
  const [title, setTitle] = useState("Activity manager");
  const [openD, setOpenD] = useState(false); // Stato per la dialog
  const [email, setEmail] = useState(''); // Stato per l'email
  const [message, setMessage] = React.useState<TypeMessage>({}); // Lo stato è un array di stringhe
  const [emailOptions, setEmailOptions] = React.useState<string[]>([]); // Lo stato è un array di stringhe
  const [emailLogin, setEmailLogin] = useState(''); // Stato per l'email
  const location = useLocation();
  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
  const handleChangeEmailFamily = (event: React.ChangeEvent<HTMLInputElement>) => {

  };


  useEffect(() => {
    if (location.pathname === '/') {
      // Stato per userData
      setUserData({
        name: "Simulated User",
        emailFamily: "user@simulated.com",
        email: "user@simulated.com",
        type: TypeUser.STANDARD
      });
      setUserDataChild({
        name: "Simulated child User",
        emailFamily: "child@simulated.com",
        email: "user@simulated.com",
        type: TypeUser.FAMILY
      });
      setUser(null);
    }

    return () => {
    };
  }, [location]);


  useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
    };
    setEmailOptions([]);
    window.addEventListener("resize", handleResize);


    // Pulisci il listener al dismount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [userData, setUserData] = useState({
    name: "Simulated User",
    emailFamily: "user@simulated.com",
    email: "user@simulated.com",
    type: -1
  }); // Stato per userData

  const [userDataChild, setUserDataChild] = useState({
    name: "Simulated child User",
    emailFamily: "child@simulated.com",
    email: "user@simulated.com",
    type: -1
  }); // Stato per userData

  const handleConfirm = ((typeSimulated: number, emailFather: string) => {
    console.log("Email confermata:", email);
    userData.email = emailFather;
    userData.emailFamily = email;
    userData.type = typeSimulated;
    setUser(userData);
    handleCloseD();
    //navigateRouting(navigate, `activity`,{});

    //saveUserData(userData, setLoading);
  });
  let check = false;
  useEffect(() => {
    if (user) {

      // Naviga solo quando `user` è stato aggiornato
      if (user.type === 2 && !check) {

        navigateRouting(navigate, 'register', {});
        check = true;
      }
      else if ((user.type === 0 || user.type === 1) && !check) {
        navigateRouting(navigate, 'activity', {});
        check = false;
      }
    }
  }, [user]);

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
   //   token: fakeResponse.credential,
      type: type
    };
    activityStore.setToken(fakeResponse.credential);
    pointsStore.setToken(fakeResponse.credential);
    familyStore.setToken(fakeResponse.credential);
    registerStore.setToken(fakeResponse.credential);
    operativeStore.setToken(fakeResponse.credential);
    setUserData(user);
    getEmailChild(user).then((x: any) => {
      const emailChild = x?.testo ?? [];
      setEmailOptions(emailChild);
      const typeNew = emailChild?.length > 0 ? type : 2;
      console.log("Login simulato effettuato:", fakeResponse);
      showDialog(typeNew, false);
    })
  };

  const showDialog = (type: number, googleAuth: boolean, userDataGoogle?: any): void => {
    const userType = userDataGoogle ? { ...userDataGoogle, emailFamily: userDataGoogle.email } : type === 0 ? { ...userDataChild } : { ...userData }
    openHome({ ...userType, type: type }, googleAuth, setLoading)
  }

  const openHome = (userD: any, googleAuth: boolean, setLoading: any): Promise<any> => {
    //  const utente = { email: userData.email, type: userData.type }
    return getTypeUser(userD, () => showMessage(setOpen, setMessage), setLoading).then((x) => {
      console.log('User Data:', x); // Logga i dati utente per il debug

      switch (x?.testo?.typeUser) {
        case 0: {
          setEmailLogin(userD.email);
          setSimulated(TypeUser.STANDARD);
          setUser({ ...userD, type: x.testo.typeUser });
          //   navigateRouting(navigate, `activity`, {});
          break;
        }
        case 1: {
          setEmailLogin(userD.email);
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
            setUser({ ...userData, type: 2 });
          }
          //  navigateRouting(navigate, `register`, {})
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
    activityStore.clearToken();
    getToken({ email: 'user' }).then(tokenData => {
      setSimulated(type);
      console.log("tokenData", tokenData);
      const fakeResponse = {
        credential: tokenData.token,
        clientId: "549622774155-atv0j0qj40r1vpl1heibaughtf0t2lon.apps.googleusercontent.com",
        select_by: "google",
      };
      handleLoginSuccessFake(fakeResponse, type);
    })

  };
  const userLabel = user ? user.name : "Non autenticato"
  const label = 'Login ' + userLabel;
  return (
    <>
      {open && (
        <Alert onClose={handleClose} message={message} />
      )}

      {/* Google OAuth Provider */}
      <GoogleOAuthProvider clientId="549622774155-atv0j0qj40r1vpl1heibaughtf0t2lon.apps.googleusercontent.com">
        <div>
          {!user ? (
            <><div id="text-box-email-family">
              <TextField
                id="emailFamily"
                label=''
                variant="standard"
                value={label} // Collega il valore allo stato
                onChange={handleChangeEmailFamily} // Aggiorna lo stato quando cambia
                fullWidth
                disabled={true} />
            </div><div>
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
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <ButtonMui
                          variant="contained"
                          color="primary"
                          onClick={() => simulateLogin(TypeUser.STANDARD)}
                          fullWidth
                        >
                          Simula login utente base
                        </ButtonMui>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
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
                      <Grid size={{ xs: 12 }}>
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
                        sx={{ width: '100%', minWidth: '300px' }} // Imposta una larghezza di almeno la larghezza di uno smartphone

                      >
                        {

                          emailOptions?.map((option) => (
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
              </div></>
          ) : (
            <div>

              <h2>{title}</h2>
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/register" element={<Register setTitle={setTitle} />} />
                <Route path="/activity" element={<Activity setTitle={setTitle} />} />
                <Route path="/about" element={<About setTitle={setTitle} />} />
                <Route path="/points" element={<Points setTitle={setTitle} />} />
                <Route path="/operative" element={<Operative setTitle={setTitle} />} />
                <Route path="/family" element={<Family setTitle={setTitle} />} />
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
  if (user.type === TypeUser.FAMILY || user.type === TypeUser.NEW_USER) {
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
  const messageBE = message?.message ? { message: message?.message, typeMessage: message?.typeMessage } : { message: ['Il server non risponde'], typeMessage: 'error' };
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
