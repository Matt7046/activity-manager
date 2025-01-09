import { observer } from 'mobx-react';
import BaseStore from '../../../general/BaseStore';

export class AboutStore extends BaseStore {
  


  constructor() {
    super(); // Inizializza la classe base

  }

  getStore() {
    return this;
  }
}
const aboutStore = new AboutStore();
export default aboutStore;





