import { TypeMessage } from "../../page/page-layout/PageLayout";
import { ResponseI } from "../structure/Utils";
import { PATH_AUTH, postData } from "./AxiosService";


export const getUserType = async (user: any, funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void) : Promise<ResponseI | undefined>=> {
  try {

    const path = PATH_AUTH + `/dati`;
    const data = await postData(path, user, setLoading, funzioneMessage); // Endpoint dell'API
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
  }
};

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



