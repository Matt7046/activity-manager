import { extendObservable } from "mobx";

class BaseStore {
    constructor() {
        extendObservable(this, {
            // Proprietà e metodi comuni
        });
    }   
}

export default BaseStore;
