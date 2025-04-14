import axios from 'axios';
import { TypeMessage } from '../page/page-layout/PageLayout';
import { HttpStatus, ServerMessage, TypeAlertColor } from './Constant';
import apiConfig from './service/ApiConfig';

const apiClient = () => {
  const token = localStorage.getItem('token');


  return axios.create({
    baseURL: apiConfig.baseURL,
    timeout: 20000,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });

}
  // Funzione per ottenere dati dall'API
export const getData = async (endpoint: string, setLoading?: (loading: boolean) => void) => {
  setLoading = setLoading ?? (() => { });
  setLoading(true);  // Mostra lo spinner prima della richiesta
  try {
    const response = await apiClient().get(endpoint);
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
    const response = await apiClient().post(endpoint, data);
    response.data.status = response.data.status === undefined ? HttpStatus.OK : response.data.status;
    const message: TypeMessage = {
      typeMessage:  response.data.status === HttpStatus.OK ? TypeAlertColor.SUCCESS : TypeAlertColor.ERROR ,
      message : response.data.status === HttpStatus.OK ? null : response.data.errors,
    }
    eseguiAlert(funzioneMessage!, message, showSuccess, response);
    return response.data; // Restituisce i dati della risposta
  } catch (error: any) {
    eseguiAlert(funzioneMessage!, { typeMessage: TypeAlertColor.ERROR , message: [ServerMessage.SERVER_DOWN] }, showSuccess);
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
    const response = await apiClient().put(endpoint, data);
    response.data.status = response.data.status === undefined ? 200 : response.data.status;
    const message: TypeMessage = {
      typeMessage: TypeAlertColor.SUCCESS 
    }
    eseguiAlert(funzioneMessage!, message, showSuccess, response);
    return response.data; // Restituisce i dati della risposta
  } catch (error: any) {
    eseguiAlert(funzioneMessage!, { typeMessage: TypeAlertColor.ERROR , message: [ServerMessage.SERVER_DOWN] }, showSuccess);
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
    typeMessage: TypeAlertColor.SUCCESS
  }
  try {
    const response = await apiClient().delete(endpoint);
    response.data.status = response.data.status === undefined ? 200 : response.data.status;
    eseguiAlert(funzioneMessage!, message, showSuccess, response);
    return response.data; // Restituisce i dati della risposta
  } catch (error: any) {
    eseguiAlert(funzioneMessage!, { typeMessage: TypeAlertColor.ERROR , message: [ServerMessage.SERVER_DOWN] }, showSuccess);
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
    eseguiAlert(funzioneMessage!, { typeMessage: TypeAlertColor.ERROR , message: [ServerMessage.SERVER_DOWN] }, showSuccess);
    return 'ok'; // Restituisce i dati della risposta
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
      message.typeMessage = TypeAlertColor.ERROR 
    } else {
      message.message = ['Operazione avvenuta con successo']
    }
    if (message.typeMessage === TypeAlertColor.ERROR || (message.typeMessage === TypeAlertColor.SUCCESS && showSuccess === true)) {
      funzioneMessage(message);
    }
  }
}

export const PATH_AUTH = 'auth'
export const PATH_REGISTER = 'register';
export const PATH_ACTIVITY = 'activity';
export const PATH_USER_POINT = 'userpoint';
export const PATH_OPERATIVE = 'operative';
export const PATH_FAMILY = 'family';
export const PATH_LOGACTIVITY = 'logactivity';
export const PATH_NOTIFICATION = 'notification';




