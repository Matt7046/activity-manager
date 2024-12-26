import { getData, postData } from "../../../general/AxiosService";
import { ResponseI } from "../../../general/Utils";

export const fetchDataActivity = async (funzioneErrore?:()=>void,  setLoading?:(loading: boolean)=>void): Promise<ResponseI | undefined> => {
  try {
    const data = await getData(`activity`, setLoading); // Usa l'URL dinamico
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
    if (funzioneErrore) {
      funzioneErrore();
    }
  }
};


export const fetchDataActivityById = async (_id: string, funzioneErrore?:()=>void, setLoading?:(loading: boolean)=>void) => {
  try {
    _id = _id ? _id : '-1';
    const path = `activity/${_id}`;
    const data = await getData(path, setLoading); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
    if (funzioneErrore) {
      funzioneErrore();
    }
  }
};

export const logActivityByEmail = async (pointsDTO: any, funzioneErrore?:()=>void, setLoading?:(loading: boolean)=>void) => {
  try {
    const data = await postData(`activity/log`,pointsDTO, setLoading); // Usa l'URL dinamico
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
    if (funzioneErrore) {
      funzioneErrore();
    }
  }
};



