import { deleteData, postData } from "../../../general/AxiosService";



export const deleteAboutById = async (_id: string, funzioneErrore?:()=>void, setLoading?:(loading: boolean)=>void) => {
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


export const saveAboutById = async (_id: string, about: any, funzioneErrore?:()=>void, setLoading?:(loading: boolean)=>void) => {
  try {
    const path = `operative/dati`;
    const data = await postData(path, about,setLoading); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
    if (funzioneErrore) {
      funzioneErrore();
    }
  }
};

