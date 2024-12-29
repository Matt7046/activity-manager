import '@fortawesome/fontawesome-free/css/all.min.css';
import { Alert, Button as ButtonMui, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, TextField } from '@mui/material';
import { GoogleLogin, GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { NavigateFunction, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import { MenuLaterale } from './components/msdrawer/Drawer';
import { TypeUser, UserI } from './general/Utils';
import About from './page/page-about/About';
import Activity from './page/page-activity/Activity';
import Family from './page/page-family/Family';
import { TypeMessage } from './page/page-layout/PageLayout';
import Operative from './page/page-operative/Operative';
import Points from './page/page-points/Points';
import { savePoints } from './page/page-points/service/PointsService';



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
  const [errors, setErrors] = useState('')
  const [loading, setLoading] = useState(false);
  const [simulated, setSimulated] = useState(false);
  const [title, setTitle] = useState("");
  const [openD, setOpenD] = useState(false); // Stato per la dialog
  const [email, setEmail] = useState(""); // Stato per l'email
  const [userData, setUserData] = useState({
    name: "Simulated User",
    email: "user@simulated.com",
    token: null,
    type: -1
  }); // Stato per userData

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
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(event.target.value);
  const handleConfirm = ((userData: any) => {
    console.log("Email confermata:", email);
    userData.emailFamily = email;   
    setUser(userData);
    saveUserData(userData, setLoading);
  });

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
    const user = {
      ...userData,
      token: fakeResponse.credential,
      type: type
    };
    setUserData(user);
    //  

    console.log("Login simulato effettuato:", fakeResponse);
    showDialog(type);

  };

  const showDialog = (type: number): void => {

    if (type === TypeUser.FAMILY) {
      handleOpenD();
    } else {
      setUser({...userData, type : type});
      saveUserData({...userData, type : type}, setLoading);
    }
    navigateRouting(navigate, `activity`, {})
  }




  const saveUserData = (userData: any, setLoading: any): void => {
 //  const utente = { email: userData.email, type: userData.type }
    savePoints(userData, () => showMessage(setOpen, setErrors), setLoading)
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
        const userData = await userDataResponse.json();
        setUser({...userData, type : 1});
        saveUserData({...userData, type : 1}, setLoading);
        console.log('User Data:', userData); // Logga i dati utente per il debug
        navigateRouting(navigate, `activity`, {})
      } else {
        console.error('Failed to fetch user data:', userDataResponse.status);
      }
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  }

  // Simulazione del login con Google
  const simulateLogin = (type: number) => {
    setSimulated(true);
    const fakeResponse = {
      credential: "fake-token-id",
      clientId: "549622774155-atv0j0qj40r1vpl1heibaughtf0t2lon.apps.googleusercontent.com",
      select_by: "google",
    };
    handleLoginSuccessFake(fakeResponse, type);
  };

  return (
    <>
      {/* Snackbar per notifiche */}
      <Snackbar
        open={open}
        autoHideDuration={6000} // Chiude automaticamente dopo 6 secondi
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Posizione del messaggio
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {errors}
        </Alert>
      </Snackbar>

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

                {/* Pulsante per simulare il login */}
                <ButtonMui variant="contained" color="primary" onClick={() => simulateLogin(TypeUser.STANDARD)}>
                  Simula Login (STANDARD) con Google</ButtonMui>
                <ButtonMui variant="contained" color="primary" onClick={() => simulateLogin(TypeUser.FAMILY)}>
                  Simula Login con Google</ButtonMui>


                {/* Pulsante di login reale */}
                <GoogleLogin onSuccess={() => login()} onError={logOut} />
              </div>

              <div>


                {/* Dialog */}
                <Dialog open={openD} onClose={handleCloseD}>
                  <DialogTitle>Inserisci la tua email</DialogTitle>
                  <DialogContent>
                    <TextField
                      autoFocus
                      margin="dense"
                      label="Email"
                      type="email"
                      fullWidth
                      value={email}
                      onChange={handleEmailChange}
                    />
                  </DialogContent>
                  <DialogActions>
                    <ButtonMui onClick={handleCloseD} color="secondary">
                      Annulla
                    </ButtonMui>
                    <ButtonMui
                      onClick={() => handleConfirm(userData)}
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
        { funzione: null, testo: 'About' },
        { funzione: null, testo: 'Points' },
        { funzione: null, testo: 'Operative' },
      ]
    ];
  }
}

export const showMessage = (setOpen: any, setMessage: any, message?: TypeMessage) => {
  const messageBE = message?.message ? { message: message?.message, typeMessage: message?.typeMessage } : { message: 'Il server non risponde', typeMessage: 'error' };
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
