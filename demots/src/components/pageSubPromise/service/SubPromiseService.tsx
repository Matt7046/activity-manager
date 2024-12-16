import { getData } from '../../general/AxiosService';

export const fetchDataPromise = async (funzioneErrore?: any) => {
  try {
    const data = await getData('/subPromise'); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
    if (funzioneErrore) {
      funzioneErrore();
    }
  }
}



export const fetchDataPromiseById = async (_id: string, funzioneErrore?: any) => {
  try {
    _id = _id ? _id : '-1';
    const path = `/subPromise/${_id}`;
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


