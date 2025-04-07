import { PATH_POINTS, postData } from "../../../general/AxiosService";
import { ServiceName } from "../../../general/service/ApiConfig";
import { ResponseI, UserI } from "../../../general/Utils";
import { TypeMessage } from "../../page-layout/PageLayout";



export const findByEmail = async (user: UserI, funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void): Promise<ResponseI | undefined> => {
  try {
    const path = PATH_POINTS+ `/find`;
    const data = await postData(ServiceName.POINTS,path, user, setLoading, funzioneMessage); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
  }
};


export const getEmailChild = async (userDTO: any, funzioneErrore?: () => void, setLoading?: (loading: boolean) => void): Promise<ResponseI | undefined> => {
  try {
    const path = PATH_POINTS + `/child`;
    const data = await postData(ServiceName.POINTS, path, userDTO, setLoading); // Usa l'URL dinamico
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
    if (funzioneErrore) {
      funzioneErrore();
    }
  }
};





