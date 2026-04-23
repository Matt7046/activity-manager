export interface SingleServiceConfig {
  baseURL: string;
}

// Configurazione completa per tutti i servizi
const apiConfig: SingleServiceConfig = {
<<<<<<< HEAD
  baseURL: process.env.REACT_APP_SERVICE_URL || '/api',
=======
  baseURL: process.env.REACT_APP_SERVICE_URL || 'http://173.212.220.20/api',
>>>>>>> d76af0e0a8c1fae4800ebd0e733bb5310558782a
};

export default apiConfig;