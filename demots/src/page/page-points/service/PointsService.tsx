import { postData } from "../../../general/AxiosService";
import { UserI } from "../../../general/Utils";
import { TypeMessage } from "../../page-layout/PageLayout";



export const findByEmail = async (user:UserI, funzioneMessage?:(message?: TypeMessage)=>void, setLoading?:(loading: boolean)=>void) => {
  try {
    const path = `points`;
    const data = await postData(path,user, setLoading, funzioneMessage); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);  
  }
};

export const savePoints = async (user: any, funzioneMessage?:(message?: TypeMessage)=>void , setLoading?:(loading: boolean)=>void) => {
  try {
    const path = `points/dati`;
    const data = await postData(path, user, setLoading, funzioneMessage); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);  
  }
};


export const savePointsByTypeStandard = async (user: any, funzioneMessage?:(message?: TypeMessage)=>void , setLoading?:(loading: boolean)=>void) => {
  try {
    const path = `points/dati`;
    const data = await postData(path, user, setLoading, funzioneMessage); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);  
  }
};



