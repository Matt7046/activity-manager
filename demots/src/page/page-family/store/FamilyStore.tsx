import { observer } from 'mobx-react';
import BaseStore from '../../../general/BaseStore';

export class FamilyStore extends BaseStore {
  


  constructor() {
    super(); // Inizializza la classe base

  }

  getStore() {
    return this;
  }
}
const activityStore = new FamilyStore();
export default activityStore;





