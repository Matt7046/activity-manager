import { deleteData } from "../../../general/AxiosService";



export const deleteOperativeById = async (_id: string, funzioneErrore?:()=>void, setLoading?:(loading: boolean)=>void) => {
  try {
    _id = _id ? _id : '-1';
    const path = `operative/${_id}`;
    const data = await deleteData(path, setLoading); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
    if (funzioneErrore) {
      funzioneErrore();
    }
  }
};

