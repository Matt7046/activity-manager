import { getData, PATH_NOTIFICATION, postData } from "../../../general/AxiosService";
import { NotificationI, ResponseI } from "../../../general/Utils";
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


export const saveNotification = async (notification: NotificationI[], funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void): Promise<ResponseI | undefined> => {
  try {
    const path = PATH_NOTIFICATION + '/entity';
    const showSuccess = true;
    const data = await postData(path, notification, setLoading, funzioneMessage, showSuccess); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
  }
};

