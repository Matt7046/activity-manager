import { PATH_USER_POINT, postData } from "../../../general/service/AxiosService";
import { ResponseI, UserI } from "../../../general/structure/Utils";
import { TypeMessage } from "../../page-layout/PageLayout";
import { UserPointsI } from "../UserPoint";



export const findByEmail = async (user: UserI, funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void): Promise<ResponseI | undefined> => {
  try {
    const path = PATH_USER_POINT+ `/find`;
    const data = await postData(path, user, setLoading, funzioneMessage); // Endpoint dell'API
    return data;
  } catch (error) {
  }
};



export const getEmailChild = async (userDTO: any, funzioneErrore?: () => void, setLoading?: (loading: boolean) => void): Promise<ResponseI | undefined> => {
  try {
    const path = PATH_USER_POINT + `/child`;
    const data = await postData(path, userDTO, setLoading); // Usa l'URL dinamico
    return data;
  } catch (error) {
    if (funzioneErrore) {
      funzioneErrore();
    }
  }
};

export const saveUser = async (userDTO: UserPointsI, funzioneErrore?: () => void, setLoading?: (loading: boolean) => void): Promise<ResponseI | undefined> => {
  try {
    const path = PATH_USER_POINT + `/dati/user`;
    const data = await postData(path, userDTO, setLoading); // Usa l'URL dinamico
    return data;
  } catch (error) {
    if (funzioneErrore) {
      funzioneErrore();
    }
  }
};



export const saveUserImage = async (userDTO: UserPointsI, funzioneErrore?: () => void, setLoading?: (loading: boolean) => void): Promise<ResponseI | undefined> => {
  try {
    const path = PATH_USER_POINT + `/dati/user/image`;
    const data = await postData(path, userDTO, setLoading); // Usa l'URL dinamico
    return data;
  } catch (error) {
    if (funzioneErrore) {
      funzioneErrore();
    }
  }
};






