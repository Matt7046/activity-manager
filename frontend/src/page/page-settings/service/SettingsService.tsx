import { PATH_USER_POINT, postData } from "../../../general/service/AxiosService";
import { ResponseI } from "../../../general/structure/Utils";
import { TypeMessage } from "../../page-layout/PageLayout";
import { UserPointsI } from "../../page-user-point/UserPoint";


export const updateStatus = async (userDTO: UserPointsI, funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void): Promise<ResponseI | undefined> => {
  try {
    const path = PATH_USER_POINT + `/dati/user/status`;
    const showSuccess = true;
    const data = await postData(path, userDTO, setLoading, funzioneMessage, showSuccess); // Usa l'URL dinamico
    return data;
  } catch (error) {
  }
};

