import { PATH_REGISTER, postData } from "../../../general/AxiosService";
import { TypeMessage } from "../../page-layout/PageLayout";


export const saveUserByPoints = async (register: any, funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void) => {
  try {
    const path = PATH_REGISTER + `/dati`;
    const showSuccess = true;
    const data = await postData(path, register, setLoading, funzioneMessage, showSuccess); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
  }
};

