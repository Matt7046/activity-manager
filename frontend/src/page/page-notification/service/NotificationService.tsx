import { getData, PATH_NOTIFICATION } from "../../../general/AxiosService";
import { TypeMessage } from "../../page-layout/PageLayout";


export const getNotificationsByIdentificativo = async (identificativo: string, page: number, size: number, funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void) => {
  try {
    const path = PATH_NOTIFICATION + `/all/` + identificativo + "/" + page + "/" + size;
    const showSuccess = true;
    const data = await getData(path, setLoading); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
  }
};

