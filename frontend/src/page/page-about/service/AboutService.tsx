import { deleteData, PATH_ABOUT, postData, showMessageForm } from "../../../general/AxiosService";
import { TypeMessage } from "../../page-layout/PageLayout";



export const deleteAboutById = async (_id: string, funzioneMessage?:(message?: TypeMessage)=>void, setLoading?:(loading: boolean)=>void) => {
  try {
    _id = _id ? _id : '-1';
    const path = PATH_ABOUT + `/${_id}`;
    const showSuccess = true;
    const data = await deleteData(path, setLoading, funzioneMessage, showSuccess); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);    
  }
};


export const saveAboutByUser = async (about: any, funzioneMessage?:(message?: TypeMessage)=>void, setLoading?:(loading: boolean)=>void) => {
  try {
    const path = PATH_ABOUT + `/dati`;
    const showSuccess = true;
    const data = await postData(path, about,setLoading, funzioneMessage, showSuccess); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);   
  }
};

export const showMessageAboutForm = async (funzioneMessage?:(message?: TypeMessage)=>void, setLoading?:(loading: boolean)=>void) => {
  try {  
    const showSuccess = true;
    const data = await showMessageForm(setLoading, funzioneMessage, showSuccess); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);   
  }
};

