import { extendObservable } from "mobx";

class BaseStore {
    token: string | null = null;
    constructor() {
        extendObservable(this, {
            // Proprietà e metodi comuni
        });
    }
    setToken(token: string) {
        this.token = token;
        localStorage.setItem('token', token); // Salva il token nel localStorage
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('token');
    }

    get isAuthenticated() {
        return this.token !== null;
    }

    // Recupera il token dal localStorage quando l'app viene caricata
    loadTokenFromLocalStorage() {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            this.setToken(storedToken);
        }
    }


}



export default BaseStore;
