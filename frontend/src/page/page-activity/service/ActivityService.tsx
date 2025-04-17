import { deleteData, PATH_ACTIVITY, postData, showMessageForm } from "../../../general/service/AxiosService";
import { ResponseI } from "../../../general/structure/Utils";
import { TypeMessage } from "../../page-layout/PageLayout";
import { UserPointsI } from "../../page-user-point/UserPoint";
import { ActivityLogI } from "../Activity";

export const fetchDataActivities = async (pointsDTO: UserPointsI, funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void): Promise<ResponseI | undefined> => {
  try {
    const path = PATH_ACTIVITY + '/activities'
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


export const deleteAboutById = async (_id: string, funzioneMessage?:(message?: TypeMessage)=>void, setLoading?:(loading: boolean)=>void) => {
  try {
    _id = _id ? _id : '-1';
    const path = PATH_ACTIVITY +'/toggle'+ `/${_id}`;
    const showSuccess = true;
    const data = await deleteData(path,  setLoading, funzioneMessage, showSuccess); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);    
  }
};


export const saveAboutByUser = async (about: any, funzioneMessage?:(message?: TypeMessage)=>void, setLoading?:(loading: boolean)=>void) => {
  try {
    const path = PATH_ACTIVITY + `/dati`;
    const showSuccess = true;
    const data = await postData(path, about,setLoading, funzioneMessage, showSuccess); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);   
  }
};

export const showMessageAboutForm = async (funzioneMessage?:(message?: TypeMessage)=>void, setLoading?:(loading: boolean)=>void) => {
  try {  
    const showSuccess = true;
    const data = await showMessageForm(setLoading, funzioneMessage, showSuccess); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);   
  }
};





