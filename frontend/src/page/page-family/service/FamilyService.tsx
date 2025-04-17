import { PATH_FAMILY, postData } from "../../../general/service/AxiosService";
import { ResponseI } from "../../../general/structure/Utils";
import { TypeMessage } from "../../page-layout/PageLayout";



export const logFamilyByEmail = async (pointsDTO: any, funzioneErrore?: () => void, setLoading?: (loading: boolean) => void): Promise<ResponseI | undefined> => {
  try {
    const path = PATH_FAMILY + `/log/tutor`;
    const data = await postData(path, pointsDTO, setLoading); // Usa l'URL dinamico
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
    if (funzioneErrore) {
      funzioneErrore();
    }
  }
};


export const savePointsByFamily = async (user: any, funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void,
  showSuccess?: boolean): Promise<ResponseI | undefined> => {
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

