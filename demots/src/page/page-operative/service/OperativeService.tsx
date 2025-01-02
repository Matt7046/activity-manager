import { deleteData, showMessageForm } from "../../../general/AxiosService";
import { TypeMessage } from "../../page-layout/PageLayout";



export const deleteOperativeById = async (_id: string, funzioneErrore?:()=>void, setLoading?:(loading: boolean)=>void) => {
  try {
    _id = _id ? _id : '-1';
    const path = `operative/${_id}`;
    const data = await deleteData(path, setLoading); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
    if (funzioneErrore) {
      funzioneErrore();
    }
  }
};

export const showMessageOperativeForm = async (funzioneMessage?:(message?: TypeMessage)=>void, setLoading?:(loading: boolean)=>void) => {
  try {  
    const showSuccess = true;
    const data = await showMessageForm(setLoading, funzioneMessage, showSuccess); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);   
  }
};

