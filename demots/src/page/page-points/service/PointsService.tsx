import { postData } from "../../../general/AxiosService";
import { TypeMessage } from "../../page-layout/PageLayout";



export const findByEmail = async (email: string, funzioneMessage?:(showSuccess?: boolean , message?: TypeMessage)=>void, setLoading?:(loading: boolean)=>void) => {
  try {
    const path = `points`;
    const data = await postData(path, { email }, setLoading, funzioneMessage); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);  
  }
};

export const savePointsById = async (user: any, funzioneMessage?:(showSuccess?: boolean , message?: TypeMessage)=>void , setLoading?:(loading: boolean)=>void) => {
  try {
    const path = `points/dati`;
    const data = await postData(path, user, setLoading, funzioneMessage); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);  
  }
};



