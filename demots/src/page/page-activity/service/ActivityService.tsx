import { getData } from "../../../general/AxiosService";

export const fetchDataActivity = async (funzioneErrore?: any) => {
  try {
    const data = await getData('/activity'); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
    if (funzioneErrore) {
      funzioneErrore();
    }
  }
}



export const fetchDataActivityById = async (_id: string, funzioneErrore?: any) => {
  try {
    _id = _id ? _id : '-1';
    const path = `/activity/${_id}`;
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


