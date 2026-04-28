import { extendObservable } from "mobx";

class BaseStore {
    private static _token: string | null = null;
    private static _lang: string | null = null;
    constructor() {
        extendObservable(this, {
            // Proprietà e metodi comuni
        });
    }

    getToken(): string | null {
        return localStorage.getItem('token'); // Salva il token nel localStorage
    }
    setToken(token: string) {
        BaseStore._token = token;
        localStorage.setItem('token', token); // Salva il token nel localStorage
    }

    clearToken() {
        BaseStore._token = null;
        localStorage.removeItem('token');
    }

    getLang(): string | null {
        return localStorage.getItem('lang'); // Salva la lingua nel localStorage
    }
    
    setLang(lang: string) {
        BaseStore._lang = lang;
        localStorage.setItem("lang", lang); // Salva la lingua nel localStorage
    }

    get isAuthenticated() {
        return BaseStore._token !== null;
    }

    // Recupera il token dal localStorage quando l'app viene caricata
    loadTokenFromLocalStorage() {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            this.setToken(storedToken);
        }
    }


}

export const baseStore = new BaseStore();
export default BaseStore;

