import '@fortawesome/fontawesome-free/css/all.min.css';
import { Apple as AppleIcon, Facebook as FacebookIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; // Points
import GoogleIcon from '@mui/icons-material/Google';
import GroupIcon from '@mui/icons-material/Group'; // 
import InfoIcon from '@mui/icons-material/Info'; // About
import ListAltIcon from '@mui/icons-material/ListAlt'; // Activity
import SettingsIcon from '@mui/icons-material/Settings'; // Operative
import { Box, Button as ButtonMui, CircularProgress, Divider, IconButton, Paper, SelectChangeEvent, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import React, { ReactNode, useEffect, useState } from 'react';
import { Link, NavigateFunction, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../App';
import Alert from '../../components/ms-alert/Alert';
import { MenuLaterale } from '../../components/ms-drawer/Drawer';
import { getToken } from '../../general/service/AuthService';
import { baseStore } from '../../general/structure/BaseStore';
import { SectionName, SectionNameDesc, ServerMessage, TypeAlertColor, TypeUser } from '../../general/structure/Constant';
import { ResponseI, UserI } from '../../general/structure/Utils';
import { TypeMessage } from '../page-layout/PageLayout';
import PrivacyPolicy from '../page-privacy-policy/PrivacyPolicy';
import { getEmailChild, getTypeUser, oldLogin } from '../page-user-point/service/UserPointService';

import DialogEmail from '../../components/ms-dialog-email/DialogEmail';
import "./HomeContent.css";



// Componente UserProvider che gestisce lo stato di `user`
interface UserProviderProps {
  children: ReactNode; // Aggiungi la prop `children` di tipo ReactNode
}

// Componente principale, avvolto da GoogleOAuthProvider
const HomeContent = () => (
  <GoogleOAuthProvider clientId="549622774155-atv0j0qj40r1vpl1heibaughtf0t2lon.apps.googleusercontent.com">
    <GoogleAuthComponent />
  </GoogleOAuthProvider>
);

// Componente di autenticazione
const GoogleAuthComponent = () => {
  const navigate = useNavigate();  // Qui chiami useNavigate correttamente all'interno di un componente


  const { user, setUser } = useUser();
  const [open, setOpen] = useState(false); // Controlla la visibilità del messaggio
  const [loading, setLoading] = useState(false);
  const [simulated, setSimulated] = useState(0);
  const [openD, setOpenD] = useState(false); // Stato per la dialog
  const [emailConfirmDialog, setEmailConfirmDialog] = useState(''); // Stato per l'email
  const [message, setMessage] = React.useState<TypeMessage>({}); // Lo stato è un array di stringhe
  const [emailOptions, setEmailOptions] = React.useState<string[]>([]); // Lo stato è un array di stringhe
  const [emailLogin, setEmailLogin] = useState(''); // Stato per l'email
  const [passwordLogin, setPasswordLogin] = useState(''); // Stato per l'email
  const location = useLocation();
  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
  const [hiddenLogin, setHiddenLogin] = useState<any>(false); // Stato utente
  const handleChangeEmailFamily = (event: React.ChangeEvent<HTMLInputElement>) => { };
  const [loginBase, setLoginBase] = useState('Simula login utente base'); // Stato per l'email
  const [loginParentale, setLoginParentale] = useState('Simula login parentale'); // Stato per l'emailà
  const [keepLoggedIn, setKeepLoggedIn] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);




  let check = false;

  const [currentUser, setCurrentUser] = useState({
    name: "",
    emailChild: "",
    email: "",
    type: -1,
    emailUserCurrent: ""
  });

  //FAKE LOGIN
  const [userDataFake, setUserDataFake] = useState({
    name: "Simulated User",
    emailChild: "user@simulated.com",
    email: "user@simulated.com",
    type: TypeUser.STANDARD,
    emailUserCurrent: "user@simulated.com"
  }); // Stato per userData
  //FAKE LOGIN
  const [userDataChildFake, setUserDataChildFake] = useState({
    name: "Simulated child User",
    emailChild: "child@simulated.com",
    email: "user@simulated.com",
    type: TypeUser.FAMILY,
    emailUserCurrent: "child@simulated.com"
  }); // Stato per userData

  useEffect(() => {

    if (location.pathname === '/home') {
      getToken({ email: 'user', password: 'qwertyuiop' }, (message: any) => showMessage(setOpen, setMessage, message, true)).then(tokenData => {
        baseStore.setToken(tokenData?.jsonText?.token);

      })
      // Stato per userData
      setCurrentUser({
        name: "",
        emailChild: "",
        email: "",
        type: -1,
        emailUserCurrent: ""
      });
      setUser(null);
      check = true;
    }
    setHiddenLogin(location.pathname === '/privacy-policy')
    return () => {
    };
  }, [location]);
  useEffect(() => {
    if (user) {

      // Naviga solo quando `user` è stato aggiornato
      if (user.type === 2 && !check) {

        navigateRouting(navigate, SectionName.REGISTER, {});
        check = true;
      }
      else if ((user.type === 0 || user.type === 1) && !check) {
        navigateRouting(navigate, SectionName.ACTIVITY, {});
        check = false;
      }
    }
  }, [user]);



  useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
    };
    setEmailOptions([]);
    window.addEventListener("resize", handleResize);


    // Pulisci il listener al dismount
    return () => window.removeEventListener("resize", handleResize);
  }, []);



  const handleConfirm = ((typeSimulated: number, emailUserCurrent: string) => {
    currentUser.email = emailLogin;
    currentUser.emailChild = emailConfirmDialog;
    currentUser.type = typeSimulated;
    currentUser.emailUserCurrent = emailUserCurrent;
    setUser(currentUser);
    handleCloseD();

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
    setEmailConfirmDialog(event.target.value);
  };

  // Configura useGoogleLogin
  const login = useGoogleLogin({
    onSuccess: (codeResponse: any) => {

      const accessToken = codeResponse?.access_token;
      // Puoi usare l'access token per fare richieste all'API di Google
      fetchUserData(accessToken);

    },
    onError: (error) => {
      console.error('Login Failed:', error);
    },
  });



  const handleLoginSuccessFake = (type: number) => {
    const currentUser = type === 0 ? { ...userDataChildFake } : { ...userDataFake }
    const user = {
      ...currentUser,
      //   token: fakeResponse.credential,
      type: type
    };
    setCurrentUser(user);
    const message = { message: [ServerMessage.SERVER_DOWN], typeMessage: TypeAlertColor.ERROR };   
      showDialog(type, false);    
  };

  const showDialog = (type: number, googleAuth: boolean, userDataGoogle?: any): void => {
    const currentUser = googleAuth ? { ...userDataGoogle, emailChild: userDataGoogle.email } : type === 0 ? { ...userDataChildFake } : { ...userDataFake }
    openHome({ ...currentUser, type: type }, googleAuth, setLoading)
  }

  const openHome = (currentUser: any, googleAuth: boolean, setLoading: any): Promise<any> => {
    return getEmailChild({...currentUser, email: currentUser.emailChild}).then((x: ResponseI | undefined) => {
      const emailChild = x?.jsonText?.emailFigli ?? [];
      setEmailOptions(emailChild);
      currentUser.type = emailChild?.length > 0 ? currentUser.type  : 2;      
    }).then(x => {
      getTypeUser(currentUser, () => showMessage(setOpen, setMessage, message, true), setLoading).then((x) => {
        setEmailLogin(x?.jsonText.emailUserCurrent);
        switch (x?.jsonText?.typeUser) {
          case TypeUser.STANDARD: {
            setEmailLogin(currentUser.email);
            setSimulated(TypeUser.STANDARD);
            setUser({ ...currentUser, type: x.jsonText.typeUser, emailChild: currentUser.emailUserCurrent ,emailUserCurrent: x.jsonText.emailUserCurrent });
            break;
          }
          case TypeUser.FAMILY: {
            setEmailLogin(currentUser.email);
            setSimulated(TypeUser.FAMILY);
            handleOpenD();
            break;
          }
          case TypeUser.NEW_USER: {
            if (googleAuth === true) {
              setUser({ ...currentUser, type: x.jsonText.typeUser, emailUserCurrent: x.jsonText.emailUserCurrent });

            }
            else {
              setUser({ ...currentUser, type: 2 });
            }
          }
            break;
        }
      })
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
        userDataGoogle.emailUserCurrent = userDataGoogle.email;
        userDataGoogle.emailChild = userDataGoogle.email;
        setEmailLogin(userDataGoogle.email);

        //setUser({ ...userData, type: 1 });
        setCurrentUser(userDataGoogle);
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
    const tokenData = baseStore.getToken();
    setSimulated(type);
    const fakeResponse = {
      credential: tokenData,
      clientId: "549622774155-atv0j0qj40r1vpl1heibaughtf0t2lon.apps.googleusercontent.com",
      select_by: "google",
    };
    handleLoginSuccessFake(type);


  };
  const label = 'I login simulati servono per testare le funzionalità senza condividere dati';

  const handleChangeUsername = (event: any): void => {
    setEmailLogin(event.target.value);
  }

  const handleChangePassword = (event: any): void => {
    setPasswordLogin(event.target.value);
  }

  const togglePasswordVisibility = (event: any): void => {
    setShowPassword((prev) => !prev);

  }

  const handleLogin = (event: any): void => {
    const user = { _id: undefined, email: emailLogin, password: passwordLogin }
    oldLogin(user).then(x => {
      if (x) {
        const currentUser = x.jsonText;
        openHome(currentUser, false, setLoading)
      }
    })
  }

  const handleKeepLoggedIn = (event: any): void => {
    throw new Error('Function not implemented.');
  }

  const handleAppleLogin = (event: any): void => {
    throw new Error('Function not implemented.');
  }

  const handleFacebookLogin = (event: any): void => {
    throw new Error('Function not implemented.');
  }




  return (
    <>

      {/* Alert */}
      <Grid container justifyContent="flex-end" className="layout-alert" sx={{ mt: 2 }}>
        {open && (
          <Alert onClose={handleClose} message={message} />
        )}
      </Grid>

      {/* Route Privacy Policy */}
      <Routes>
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
      <>
        {/* Alert */}
        <Grid container justifyContent="flex-end" className="layout-alert" sx={{ mt: 2 }}>
          {open && (
            <Alert onClose={handleClose} message={message} />
          )}
        </Grid>

        {/* Route Privacy Policy */}
        <Routes>
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>

        {/* Main Login Box */}
        <GoogleOAuthProvider clientId="549622774155-atv0j0qj40r1vpl1heibaughtf0t2lon.apps.googleusercontent.com">
          <Box display="flex" justifyContent="center" mt={6} px={2} className="welcome-container1">
            <Paper elevation={3} className="login-paper">
              <Box mb={3}>
                <Typography variant="h5" align="center" gutterBottom>Accedi</Typography>
              </Box>
              <Box mt={2} textAlign="center">
                <Typography variant="body2">
                  Non hai un account?{' '}
                  <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 500 }}>
                    Registrati
                  </Link>
                </Typography>
              </Box>
              <Box mb={3}>
                <TextField
                  id="emailFamily"
                  label={'INFO'}
                  variant="standard"
                  value={label}
                  onChange={handleChangeEmailFamily}
                  fullWidth
                  disabled
                />
              </Box>

              {/* Buttons: Login Simulation and Google Login */}
              {!hiddenLogin && (
                <Grid container spacing={2}>
                 <Grid xs={12} sm={6}>
                    <ButtonMui
                      variant="contained"
                      color="primary"
                      onClick={() => simulateLogin(TypeUser.STANDARD)}
                      fullWidth
                    >
                      {loginBase}
                    </ButtonMui>
                  </Grid>

                  <Grid xs={12} sm={6} >
                    <ButtonMui
                      variant="contained"
                      color="primary"
                      onClick={() => simulateLogin(TypeUser.FAMILY)}
                      fullWidth
                    >
                      {loginParentale}
                    </ButtonMui>
                  </Grid>
                </Grid>
              )}

              <Box mb={2} className='box-login'>
                <TextField
                  id="username"
                  label="Indirizzo email"
                  variant="outlined"
                  value={emailLogin}
                  onChange={handleChangeUsername}
                  fullWidth
                />
              </Box>

              <Box mb={2} >
                <TextField
                  id="password"
                  label="Password"
                  variant="outlined"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordLogin}
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

              {/* Mantieni connessione 
              <Box mb={2} display="flex" alignItems="center">
                <Checkbox
                  checked={keepLoggedIn}
                  onChange={handleKeepLoggedIn}
                />
                <Typography variant="body2">Mantieni la connessione su questo dispositivo</Typography>
              </Box>
            */}
              <ButtonMui
                variant="contained"
                fullWidth
                onClick={handleLogin}
                className="login-button"
              >
                Accedi
              </ButtonMui>

              {/* Divider */}
              <Box display="flex" alignItems="center" mb={2} className='box-accedi'>
                <Divider sx={{ flexGrow: 1 }} />
                <Typography sx={{ mx: 2 }} variant="body2" color="textSecondary">
                  oppure accedi con
                </Typography>
                <Divider sx={{ flexGrow: 1 }} />
              </Box>

              {/* Login Social */}
              <Grid container spacing={2} justifyContent="center">
                <Grid>
                  <IconButton onClick={handleAppleLogin} className="social-button" disabled>
                    <AppleIcon />
                  </IconButton>
                </Grid>
                <Grid>
                  <IconButton onClick={handleFacebookLogin} className="social-button" disabled>
                    <FacebookIcon />
                  </IconButton>
                </Grid>
                <Grid>
                  <IconButton
                    className="social-button google-button"
                    onClick={() => login()}                  >
                    <GoogleIcon />
                  </IconButton>
                </Grid>
              </Grid>

              {/* Dialog */}
              <DialogEmail
                openD={openD}
                handleCloseD={handleCloseD}
                emailOptions={emailOptions}
                handleEmailChange={handleEmailChange}
                handleConfirm={handleConfirm}
                email={emailConfirmDialog}
                simulated={simulated}
                emailUserCurrent={emailLogin}
              />

            </Paper>
          </Box>
        </GoogleOAuthProvider>

        {/* Loader */}
        {loading && (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        )}
      </>


    </>
  );

};

export const navigateRouting = (navigate: NavigateFunction, path: SectionName, params: any) => {
  navigate(`/${path}`, { state: params }); // Passa i parametri come stato
};

export const sezioniMenuIniziale = (user: UserI): MenuLaterale[][] => {
  if (user === undefined || user === null) {
    return [[]];
  }
  if (user?.type === TypeUser.FAMILY || user.type === TypeUser.NEW_USER) {
    return [
      [
        {
          funzione: null,
          testo: SectionNameDesc.ACTIVITY,
          icon: ListAltIcon
        },
        {
          funzione: null,
          testo: SectionNameDesc.ABOUT,
          icon: InfoIcon
        },
        {
          funzione: null,
          testo: SectionNameDesc.POINTS,
          icon: EmojiEventsIcon
        },
        {
          funzione: null,
          testo: SectionNameDesc.OPERATIVE,
          icon: SettingsIcon
        },
      ],
      [
        {
          funzione: null,
          testo: SectionNameDesc.FAMILY,
          icon: GroupIcon
        }
      ]
    ];
  } else {
    return [
      [
        {
          funzione: null, testo: SectionNameDesc.ACTIVITY,
          icon: ListAltIcon
        },
        {
          funzione: null, testo: SectionNameDesc.POINTS,
          icon: EmojiEventsIcon
        },
        {
          funzione: null, testo: SectionNameDesc.OPERATIVE,
          icon: SettingsIcon
        },
      ]
    ];
  }
}

export const showMessage = (setOpen: any, setMessage: any, message?: TypeMessage, onlyError?: boolean) => {
  const messageBE = message?.message ? { message: message?.message, typeMessage: message?.typeMessage } : { message: [ServerMessage.SERVER_DOWN], typeMessage: 'error' };
  if (!onlyError || onlyError && message?.typeMessage === TypeAlertColor.ERROR) {
    setOpen(true);
  }
  setMessage(messageBE);
}



export const sezioniMenu = (
  sezioni: MenuLaterale[][],
  navigate: NavigateFunction,
  path: SectionName,
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

export default HomeContent;
