import { deleteData, postData } from "../../../general/AxiosService";
import { TypeMessage } from "../../page-layout/PageLayout";



export const deleteAboutById = async (_id: string, funzioneMessage?:(showSuccess?: boolean , message?: TypeMessage)=>void, setLoading?:(loading: boolean)=>void) => {
  try {
    _id = _id ? _id : '-1';
    const path = `about/${_id}`;
    const showSuccess = true;
    const data = await deleteData(path, setLoading, funzioneMessage, showSuccess); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);    
  }
};


export const saveAboutById = async (_id: string, about: any, funzioneMessage?:(showSuccess?: boolean , message?: TypeMessage)=>void, setLoading?:(loading: boolean)=>void) => {
  try {
    const path = `about/dati`;
    const showSuccess = true;
    const data = await postData(path, about,setLoading, funzioneMessage, showSuccess); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);   
  }
};

