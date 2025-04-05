// Tipi dei nomi dei microservizi
export enum ServiceName {
  REGISTER = 'registerService',
  ABOUT = 'aboutService',
  POINTS = 'pointsService',
  ACTIVITY = 'activityService',
  LOG_ACTIVITY = 'logActivityService',
  AUTH = 'authService',
  FAMILY = 'familyService',
  NOTIFICATION= 'notificationService'
}

// Configurazione singola di un servizio
export interface SingleServiceConfig {
  baseURL: string;
}

// Configurazione completa per tutti i servizi
const apiConfig: Record<ServiceName, SingleServiceConfig> = {
  registerService: {
    baseURL: process.env.REACT_APP_REGISTER_SERVICE_URL || 'http://localhost/api',
  },
  aboutService: {
    baseURL: process.env.REACT_APP_ABOUT_SERVICE_URL || 'http://localhost/api',
  },
  pointsService: {
    baseURL: process.env.REACT_APP_POINTS_SERVICE_URL || 'http://localhost/api',
  },
  activityService: {
    baseURL: process.env.REACT_APP_ACTIVITY_SERVICE_URL || 'http://localhost/api',
  },
  logActivityService: {
    baseURL: process.env.REACT_APP_LOG_ACTIVITY_SERVICE_URL || 'http://localhost/api',
  },
  authService: {
    baseURL: process.env.REACT_APP_LOG_AUTH_SERVICE_URL || 'http://localhost/api',
  },
  familyService: {
    baseURL: process.env.REACT_APP_LOG_FAMILY_SERVICE_URL || 'http://localhost/api',
  },
  notificationService: {
    baseURL: process.env.REACT_APP_LOG_FAMILY_SERVICE_URL || 'http://localhost/api',
  },
};

export default apiConfig;




7