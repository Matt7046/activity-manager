import { PATH_FAMILY, postData } from "../../../general/AxiosService";
import { TypeMessage } from "../../page-layout/PageLayout";



export const savePointsByFamily = async (user: any, funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void,
  showSuccess?: boolean) => {
  try {
    const path = PATH_FAMILY + `/dati`;
    showSuccess = true; 
    const data = await postData(path, user, setLoading, funzioneMessage, showSuccess); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
  }
};

