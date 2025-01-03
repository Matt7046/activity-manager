import axios from 'axios';
import { TypeMessage } from '../page/page-layout/PageLayout';
import { Alert, HttpStatus } from './Utils';

const apiUrl = process.env.REACT_APP_API_URL_LOCALE ; // Ottieni l'URL dal file .env

// Configura l'istanza di Axios
const apiClient = axios.create({
  baseURL: apiUrl, // URL base dell'API
  timeout: 20000,                     // Timeout in millisecondi
  headers: {
    'Content-Type': 'application/json', // Header predefinito
    'Authorization': 'Bearer your-token-here' // Token opzionale
  }
});

// Funzione per ottenere dati dall'API
export const getData = async (endpoint: string, setLoading?: (loading: boolean) => void) => {
  setLoading = setLoading ?? (() => { });
  setLoading(true);  // Mostra lo spinner prima della richiesta
  try {
    const response = await apiClient.get(endpoint);
    return response.data; // Restituisce i dati della risposta
  } catch (error) {
    console.error('Errore durante la richiesta:', error);
    throw error; // Propaga l'errore al chiamante
  } finally {
    setLoading(false);  // Nascondi lo spinner dopo che la risposta è arrivata
  }
};

export const postData = async (endpoint: string, data: any, setLoading?: (loading: boolean) => void,
  funzioneMessage?: (message?: TypeMessage) => void, showSuccess?: boolean
) => {
  showSuccess = showSuccess ?? false;
  setLoading = setLoading ?? (() => { });
  setLoading(true);  // Mostra lo spinner prima della richiesta
  try {
    const response = await apiClient.post(endpoint, data);
    const message: TypeMessage = {
      typeMessage: 'success'
    }
    eseguiAlert(funzioneMessage!, message, showSuccess, response);
    return response.data; // Restituisce i dati della risposta
  } catch (error: any) {
    eseguiAlert(funzioneMessage!, { typeMessage: 'error', message: [Alert.SERVER_DOWN] }, showSuccess);
    throw error;
  } finally {
    setLoading(false);  // Nascondi lo spinner dopo che la risposta è arrivata
  }
};


// Altri metodi (PUT, DELETE, ecc.)
export const putData = async (endpoint: string, data: any, setLoading?: (loading: boolean) => void,
  funzioneMessage?: (message?: TypeMessage) => void, showSuccess?: boolean
) => {
  setLoading = setLoading ?? (() => { });
  setLoading(true);  // Mostra lo spinner prima della richiesta
  showSuccess = showSuccess ?? false;
  try {
    const response = await apiClient.put(endpoint, data);
    const message: TypeMessage = {
      typeMessage: 'success'
    }
    eseguiAlert(funzioneMessage!, message, showSuccess, response);
    return response.data; // Restituisce i dati della risposta
  } catch (error: any) {
    eseguiAlert(funzioneMessage!, { typeMessage: 'error', message: [Alert.SERVER_DOWN] }, showSuccess);
    throw error;
  } finally {
    setLoading(false);  // Nascondi lo spinner dopo che la risposta è arrivata
  }
};

export const deleteData = async (endpoint: string, setLoading?: (loading: boolean) => void,
  funzioneMessage?: (message?: TypeMessage) => void, showSuccess?: boolean
) => {
  setLoading = setLoading ?? (() => { });
  setLoading(true);  // Mostra lo spinner prima della richiesta
  showSuccess = showSuccess ?? false;
  const message: TypeMessage = {
    typeMessage: 'success'
  }
  try {
    const response = await apiClient.delete(endpoint);

    eseguiAlert(funzioneMessage!, message, showSuccess, response);
    return response.data; // Restituisce i dati della risposta
  } catch (error: any) {
    eseguiAlert(funzioneMessage!, { typeMessage: 'error', message: [Alert.SERVER_DOWN] }, showSuccess);
    throw error;
  } finally {
    setLoading(false);  // Nascondi lo spinner dopo che la risposta è arrivata
  }

};


export const showMessageForm = async (setLoading?: (loading: boolean) => void,
  funzioneMessage?: (message?: TypeMessage) => void, showSuccess?: boolean
) => {
  showSuccess = showSuccess ?? false;
  setLoading = setLoading ?? (() => { });
  setLoading(true);  // Mostra lo spinner prima della richiesta
  try {  
    eseguiAlert(funzioneMessage!, { typeMessage: 'error', message: [Alert.SERVER_DOWN] }, showSuccess);
    return  'ok'; // Restituisce i dati della risposta
  } catch (error: any) {
    throw error;
  } finally {
    setLoading(false);  // Nascondi lo spinner dopo che la risposta è arrivata
  }
};


export const eseguiAlert = (funzioneMessage: (message?: TypeMessage) => void, message: TypeMessage, showSuccess: boolean, response?: any) => {
 const messaggiAlert = message.message;
  response = response ?? { data: { status: HttpStatus.BAD_REQUEST, errors: messaggiAlert } }

  if (funzioneMessage) {
    message.message = response.data.errors;
    if (response.data.status !== HttpStatus.OK) {
      message.typeMessage = 'error'
    } else {
      message.message = ['Operazione avvenuta con successo']
    }
    if (message.typeMessage === 'error' || (message.typeMessage === 'success' && showSuccess === true)) {
      funzioneMessage(message);
    }
  }
}