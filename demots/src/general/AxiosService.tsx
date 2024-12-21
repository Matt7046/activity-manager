import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL_LOCALE ; // Ottieni l'URL dal file .env

// Configura l'istanza di Axios
const apiClient = axios.create({
  baseURL: apiUrl, // URL base dell'API
  timeout: 5000,                     // Timeout in millisecondi
  headers: {
    'Content-Type': 'application/json', // Header predefinito
    'Authorization': 'Bearer your-token-here' // Token opzionale
  }
});

// Funzione per ottenere dati dall'API
export const getData = async (endpoint: string) => {
  try {
    const response = await apiClient.get(endpoint);
    return response.data; // Restituisce i dati della risposta
  } catch (error) {
    console.error('Errore durante la richiesta:', error);
    throw error; // Propaga l'errore al chiamante
  }
};

// Funzione per inviare dati all'API (esempio POST)
export const postData = async (endpoint: string, data: any) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data; // Restituisce i dati della risposta
  } catch (error) {
    console.error('Errore durante la richiesta POST:', error);
    throw error; // Propaga l'errore al chiamante
  }
};

// Altri metodi (PUT, DELETE, ecc.)
export const putData = async (endpoint: string, data: any) => {
  try {
    const response = await apiClient.put(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('Errore durante la richiesta PUT:', error);
    throw error;
  }
};

export const deleteData = async (endpoint: string) => {
  try {
    const response = await apiClient.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error('Errore durante la richiesta DELETE:', error);
    throw error;
  }
};
