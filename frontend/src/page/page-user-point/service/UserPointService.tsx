import { PATH_USER_POINT, postData } from "../../../general/service/AxiosService";
import { ResponseI, UserI } from "../../../general/structure/Utils";
import { TypeMessage } from "../../page-layout/PageLayout";
import { UserPointsI } from "../UserPoint";



export const findByEmail = async (user: UserI, funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void): Promise<ResponseI | undefined> => {
  try {
    const path = PATH_USER_POINT+ `/find`;
    const data = await postData(path, user, setLoading, funzioneMessage); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
  }
};



export const getEmailChild = async (userDTO: any, funzioneErrore?: () => void, setLoading?: (loading: boolean) => void): Promise<ResponseI | undefined> => {
  try {
    const path = PATH_USER_POINT + `/child`;
    const data = await postData(path, userDTO, setLoading); // Usa l'URL dinamico
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
    if (funzioneErrore) {
      funzioneErrore();
    }
  }
};

export const saveUser = async (userDTO: UserPointsI, funzioneErrore?: () => void, setLoading?: (loading: boolean) => void): Promise<ResponseI | undefined> => {
  try {
    const path = PATH_USER_POINT + `/dati/user`;
    const data = await postData(path, userDTO, setLoading); // Usa l'URL dinamico
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
    if (funzioneErrore) {
      funzioneErrore();
    }
  }
};



export const saveUserImage = async (userDTO: UserPointsI, funzioneErrore?: () => void, setLoading?: (loading: boolean) => void): Promise<ResponseI | undefined> => {
  try {
    const path = PATH_USER_POINT + `/dati/user/image`;
    const data = await postData(path, userDTO, setLoading); // Usa l'URL dinamico
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
    if (funzioneErrore) {
      funzioneErrore();
    }
  }
};






