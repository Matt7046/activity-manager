import { PATH_REGISTER, postData } from "../../../general/service/AxiosService";
import { TypeMessage } from "../../page-layout/PageLayout";


export const saveUserByPoints = async (register: any, funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void) => {
  try {
    const path = PATH_REGISTER + `/dati`;
    const showSuccess = true;
    const data = await postData(path, register, setLoading, funzioneMessage, showSuccess); // Endpoint dell'API
    return data;
  } catch (error) {
  }
};

