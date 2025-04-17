import BaseStore from '../../../general/structure/BaseStore';

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





