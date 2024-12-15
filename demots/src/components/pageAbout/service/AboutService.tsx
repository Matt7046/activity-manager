import { deleteData, getData, postData } from '../../general/AxiosService';



export const deleteAboutById = async (_id: string) => {
  try {
    _id = _id ? _id : '-1';
    const path = `/about/${_id}`;
    const data = await deleteData(path); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
  }
};


export const saveAboutById = async (_id: string, about: any) => {
  try {
    const path = `/about/dati`;
    const data = await postData(path, about); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
  }
};


