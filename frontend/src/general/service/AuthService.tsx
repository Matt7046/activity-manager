import { TypeMessage } from "../../page/page-layout/PageLayout";
import { PATH_AUTH, postData } from "../AxiosService";

import { ServiceName } from "./ApiConfig";



export const getToken = async (about: any, funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void) => {
  try {
    const path = PATH_AUTH + `/token`;
    const showSuccess = true;
    const data = await postData(ServiceName.AUTH, path, about, setLoading, funzioneMessage, showSuccess); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
  }
};



