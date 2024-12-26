import { postData } from "../../../general/AxiosService";



export const findByEmail = async (email: string, funzioneErrore?:()=>void, setLoading?:(loading: boolean)=>void) => {
  try {
    const path = `points`;
    const data = await postData(path, { email }, setLoading); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
    if (funzioneErrore) {
      funzioneErrore();
    }
  }
};

export const savePointsById = async (user: any, funzioneErrore?:()=>void , setLoading?:(loading: boolean)=>void) => {
  try {
    const path = `points/dati`;
    const data = await postData(path, user, setLoading); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
    if (funzioneErrore) {
      funzioneErrore();
    }
  }
};



