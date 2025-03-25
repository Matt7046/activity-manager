import { PATH_REGISTER, postData } from "../../../general/AxiosService";
import { ServiceName } from "../../../general/service/ApiConfig";
import { ResponseI } from "../../../general/Utils";
import { TypeMessage } from "../../page-layout/PageLayout";


export const saveUserByPoints = async (register: any, funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void) => {
  try {
    const path = PATH_REGISTER + `/dati`;
    const showSuccess = true;
    const data = await postData(ServiceName.REGISTER, path, register, setLoading, funzioneMessage, showSuccess); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
  }
};



export const getEmailChild = async (userDTO: any, funzioneErrore?: () => void, setLoading?: (loading: boolean) => void): Promise<ResponseI | undefined> => {
  try {
    const path = PATH_REGISTER + `/child`;
    const data = await postData(ServiceName.REGISTER, path, userDTO, setLoading); // Usa l'URL dinamico
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
    if (funzioneErrore) {
      funzioneErrore();
    }
  }
};

