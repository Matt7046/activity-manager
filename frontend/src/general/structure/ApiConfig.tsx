"use client";
export interface SingleServiceConfig {
  baseURL: string;
}

// Configurazione completa per tutti i servizi
const apiConfig: SingleServiceConfig = {
  baseURL: process.env.NEXT_PUBLIC_SERVICE_URL || '/api' 
};

export default apiConfig;