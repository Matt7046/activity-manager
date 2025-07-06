export interface SingleServiceConfig {
  baseURL: string;
}

// Configurazione completa per tutti i servizi
const apiConfig: SingleServiceConfig = {
  baseURL: process.env.REACT_APP_SERVICE_URL || 'http://173.212.220.20/api',
};

export default apiConfig;