import { observer } from 'mobx-react';
import BaseStore from '../../../general/BaseStore';

export class RegisterStore extends BaseStore {
  


  constructor() {
    super(); // Inizializza la classe base

  }

  getStore() {
    return this;
  }
}
const activityStore = new RegisterStore();
export default activityStore;





