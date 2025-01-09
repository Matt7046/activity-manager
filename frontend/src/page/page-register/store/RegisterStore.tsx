import BaseStore from '../../../general/BaseStore';

export class RegisterStore extends BaseStore {
  


  constructor() {
    super(); // Inizializza la classe base

  }

  getStore() {
    return this;
  }
}
const registerStore = new RegisterStore();
export default registerStore;





