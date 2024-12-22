import { getData, postData } from "../../../general/AxiosService";



export const findByEmail = async (email: string, funzioneErrore?: any) => {
  try {
    const path = `points`;
    const data = await postData(path, { email }); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
    if (funzioneErrore) {
      funzioneErrore();
    }
  }
};

export const findLogByEmail = async (email: string, funzioneErrore?: any) => {
  try {
    const path = `points/log`;
    const data = await postData(path, { email }); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
    if (funzioneErrore) {
      funzioneErrore();
    }
  }
};

export const savePointsById = async (user: any, funzioneErrore?: any) => {
  try {
    const path = `points/dati`;
    const data = await postData(path, user); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
    if (funzioneErrore) {
      funzioneErrore();
    }
  }
};



