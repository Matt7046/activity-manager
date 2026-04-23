export interface SingleServiceConfig {
  baseURL: string;
}

// Configurazione completa per tutti i servizi
const apiConfig: SingleServiceConfig = {
  baseURL: process.env.REACT_APP_SERVICE_URL || '/api',
};

export default apiConfig;