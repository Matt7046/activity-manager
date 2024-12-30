import { postData } from "../../../general/AxiosService";
import { ResponseI } from "../../../general/Utils";
import { TypeMessage } from "../../page-layout/PageLayout";



export const saveRegisterByPoints = async (register: any, funzioneMessage?:( message?: TypeMessage)=>void, setLoading?:(loading: boolean)=>void) => {
  try {
    const path = `register/dati`;
    const showSuccess = true;
    const data = await postData(path, register,setLoading, funzioneMessage, showSuccess); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);   
  }
};



export const getEmailChild = async (userDTO: any, funzioneErrore?: () => void, setLoading?: (loading: boolean) => void): Promise<ResponseI | undefined> => {
  try {
    const data = await postData(`register`, userDTO, setLoading); // Usa l'URL dinamico
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
    if (funzioneErrore) {
      funzioneErrore();
    }
  }
};

