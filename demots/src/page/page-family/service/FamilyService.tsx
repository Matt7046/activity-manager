import { deleteData, postData } from "../../../general/AxiosService";
import { TypeMessage } from "../../page-layout/PageLayout";



export const deleteFamilyById = async (_id: string, funzioneMessage?:(showSuccess?: boolean , message?: TypeMessage)=>void, setLoading?:(loading: boolean)=>void) => {
  try {
    _id = _id ? _id : '-1';
    const path = `Family/${_id}`;
    const showSuccess = true;
    const data = await deleteData(path, setLoading, funzioneMessage, showSuccess); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);    
  }
};


export const saveFamilyById = async (_id: string, Family: any, funzioneMessage?:(showSuccess?: boolean , message?: TypeMessage)=>void, setLoading?:(loading: boolean)=>void) => {
  try {
    const path = `Family/dati`;
    const showSuccess = true;
    const data = await postData(path, Family,setLoading, funzioneMessage, showSuccess); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);   
  }
};

