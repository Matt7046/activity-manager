import { PATH_ACTIVITY, postData } from "../../../general/AxiosService";
import { ResponseI } from "../../../general/Utils";
import { TypeMessage } from "../../page-layout/PageLayout";
import { PointsI } from "../../page-points/Points";
import { ActivityLogI } from "../Activity";

export const fetchDataActivities = async (pointsDTO: any, funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void): Promise<ResponseI | undefined> => {
  try {
    const path = PATH_ACTIVITY + '/activities'
    const data = await postData(path, pointsDTO, setLoading, funzioneMessage); // Usa l'URL dinamico
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
  }
};


export const findByIdentificativo = async (pointsDTO: PointsI,  funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void): Promise<ResponseI | undefined> => {
  try {
    const path = PATH_ACTIVITY + `/find`;
    const data = await postData(path, pointsDTO, setLoading,funzioneMessage); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);   
  }
};

export const savePointsAndLog = async (activity: ActivityLogI, funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void): Promise<ResponseI | undefined> => {
  try {
    const path = `logactivity/dati`;
    const showSuccess = true;
    const data = await postData(path, activity, setLoading, funzioneMessage, showSuccess); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
  }
};



