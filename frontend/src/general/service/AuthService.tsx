import { TypeMessage } from "../../page/page-layout/PageLayout";
import { PATH_AUTH, postData } from "./AxiosService";

export const getToken = async (about: any, funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void) => {
  try {
    const path = PATH_AUTH + `/token`;
    const showSuccess = true;
    const data = await postData(path, about, setLoading, funzioneMessage, showSuccess); // Endpoint dell'API
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
  }  
};



