import { showMessageForm } from "../../../general/service/AxiosService";
import { TypeMessage } from "../../page-layout/PageLayout";




export const showMessageOperativeForm = async (funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void) => {
  try {
    const showSuccess = true;
    const data = await showMessageForm(setLoading, funzioneMessage, showSuccess); // Endpoint dell'API
    return data;
  } catch (error) {
  }
};

