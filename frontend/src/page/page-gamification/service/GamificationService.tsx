import { getData, PATH_GAMIFICATION } from "../../../general/service/AxiosService";
import { ResponseI } from "../../../general/structure/Utils";
import { TypeMessage } from "../../page-layout/PageLayout";



export const fetchDataVideo = async (topic: string, funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void): Promise<ResponseI | undefined> => {
try {
    const path = PATH_GAMIFICATION + `/videos/` + topic;
    const showSuccess = true;
    const data = await getData(path, setLoading); // Endpoint dell'API
    return data;
  } catch (error) {
  }
};