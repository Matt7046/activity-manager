import { PATH_ACTIVITY, PATH_LOGACTIVITY, postData } from "../../../general/service/AxiosService";
import { ResponseI } from "../../../general/structure/Utils";
import { TypeMessage } from "../../page-layout/PageLayout";
import { UserPointsI } from "../../page-user-point/UserPoint";
import { ActivityLogI } from "../Activity";

export const fetchDataActivities = async (pointsDTO: any, funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void): Promise<ResponseI | undefined> => {
  try {
    const path = PATH_ACTIVITY;
    const data = await postData(path, pointsDTO, setLoading, funzioneMessage); // Usa l'URL dinamico
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
  }
};


export const findByIdentificativo = async (pointsDTO: UserPointsI,  funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void): Promise<ResponseI | undefined> => {
  try {
    const path = PATH_ACTIVITY + `/find`;
    const data = await postData(path, pointsDTO, setLoading,funzioneMessage); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);   
  }
};

export const logActivityByEmail = async (pointsDTO: any, funzioneErrore?: () => void, setLoading?: (loading: boolean) => void): Promise<ResponseI | undefined> => {
  try {
    const path = PATH_LOGACTIVITY + `/log`;
    const data = await postData(path, pointsDTO, setLoading); // Usa l'URL dinamico
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
    if (funzioneErrore) {
      funzioneErrore();
    }
  }
};



export const savePointsAndLog = async (activity: ActivityLogI, funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void): Promise<ResponseI | undefined> => {
  try {
    const path = `activity/dati`;
    const showSuccess = true;
    const data = await postData(path, activity, setLoading, funzioneMessage, showSuccess); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
  }
};



