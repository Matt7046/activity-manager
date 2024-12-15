import { getData } from '../../general/AxiosService';

export const fetchDataPromise = async () => {
  try {
    const data = await getData('/subPromise'); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
  }
}



export const fetchDataPromiseById = async (_id:string) => {
  try 
  {
    _id = _id? _id : '-1';
    const path = `/subPromise/${_id}`;
    const data = await getData(path); // Endpoint dell'API
    console.log('Dati ricevuti:', data);
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
  }
};


