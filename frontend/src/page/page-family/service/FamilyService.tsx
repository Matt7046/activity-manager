import { deleteData, PATH_FAMILY, postData } from "../../../general/AxiosService";
import { TypeMessage } from "../../page-layout/PageLayout";



export const deleteFamilyById = async (_id: string, funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void) => {
  try {
    _id = _id ? _id : '-1';
    const path = PATH_FAMILY + `/${_id}`;
    const showSuccess = true;
    const data = await deleteData(path, setLoading, funzioneMessage, showSuccess); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
  }
};


export const saveFamilyById = async (family: any, funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void) => {
  try {
    const path = PATH_FAMILY + `/dati`;
    const showSuccess = true;
    const data = await postData(path, family, setLoading, funzioneMessage, showSuccess); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
  }
};

