import { extendObservable, makeAutoObservable } from "mobx";

class BaseStore {
    constructor() {
        extendObservable(this, {
            // Proprietà e metodi comuni
        });
    
}
resetState(state: Record<string, any>) {
    Object.assign(this, state); // Resetta lo stato
}
}

export default BaseStore;
