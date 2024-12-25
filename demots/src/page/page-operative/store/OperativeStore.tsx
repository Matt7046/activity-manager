import BaseStore from '../../../general/BaseStore';

export class OperativeStore extends BaseStore {
  


  constructor() {
    super(); // Inizializza la classe base

  }

  getStore() {
    return this;
  }
}
const operativeStore = new OperativeStore();
export default operativeStore;





