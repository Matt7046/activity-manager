import { TypeMessage } from "../../page/page-layout/PageLayout";
import { ResponseI } from "../structure/Utils";
import { PATH_IMAGE, postData } from "./AxiosService";



export const upload = async (image: FormData, funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void): Promise<ResponseI | undefined> => {
  try {
    const path = PATH_IMAGE+ `/upload`;
    const data = await postData(path, image, setLoading, funzioneMessage); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
  }
};
