import { deleteData, postData } from "../../../general/AxiosService";



export const deleteAboutById = async (_id: string, funzioneErrore?:any) => {
  try {
    _id = _id ? _id : '-1';
    const apiUrl = process.env.REACT_APP_API_URL; // Ottieni l'URL dal file .env

    const path = `${apiUrl}/api/about/${_id}`;
    const data = await deleteData(path); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
    if (funzioneErrore) {
      funzioneErrore();
    }
  }
};


export const saveAboutById = async (_id: string, about: any, funzioneErrore?: any) => {
  try {
    const apiUrl = process.env.REACT_APP_API_URL; // Ottieni l'URL dal file .env

    const path = `${apiUrl}/api/about/dati`;
    const data = await postData(path, about); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
    if (funzioneErrore) {
      funzioneErrore();
    }
  }
};

