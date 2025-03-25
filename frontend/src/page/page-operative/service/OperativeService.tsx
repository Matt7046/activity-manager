import { showMessageForm } from "../../../general/AxiosService";
import { TypeMessage } from "../../page-layout/PageLayout";




export const showMessageOperativeForm = async (funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void) => {
  try {
    const showSuccess = true;
    const data = await showMessageForm(setLoading, funzioneMessage, showSuccess); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
  }
};

