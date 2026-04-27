import { makeObservable } from 'mobx';
import BaseStore from '../../../general/structure/BaseStore';

export class SettingsStore extends BaseStore {
 

  constructor() {
    super(); // Inizializza la classe base
    makeObservable(this);
  }

  getStore() {
    return this;
  }  
}
const settingsStore = new SettingsStore();
export default settingsStore;





