import { getData, postData } from "../../../general/AxiosService";

export const fetchDataActivity = async (funzioneErrore?: any) => {
  try {
    const apiUrl = process.env.REACT_APP_API_URL ; // Ottieni l'URL dal file .env
    //const apiUrl = process.env.REACT_APP_API_URL // Ottieni l'URL dal file .env

    const data = await getData(`activity`); // Usa l'URL dinamico
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
    if (funzioneErrore) {
      funzioneErrore();
    }
  }
};


export const fetchDataActivityById = async (_id: string, funzioneErrore?: any) => {
  try {
    _id = _id ? _id : '-1';
    const apiUrl = process.env.REACT_APP_API_URL; // Ottieni l'URL dal file .env

    const path = `activity/${_id}`;
    const data = await getData(path); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
    if (funzioneErrore) {
      funzioneErrore();
    }
  }
};

export const logActivityByEmail = async (pointsDTO: any,funzioneErrore?: any) => {
  try {
    const apiUrl = process.env.REACT_APP_API_URL ; // Ottieni l'URL dal file .env
    //const apiUrl = process.env.REACT_APP_API_URL // Ottieni l'URL dal file .env

    const data = await postData(`activity/log`,pointsDTO); // Usa l'URL dinamico
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
    if (funzioneErrore) {
      funzioneErrore();
    }
  }
};



