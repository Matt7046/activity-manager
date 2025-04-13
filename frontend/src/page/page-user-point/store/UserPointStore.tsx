import BaseStore from '../../../general/BaseStore';

export class PointsStore extends BaseStore {
  


  constructor() {
    super(); // Inizializza la classe base

  }

  getStore() {
    return this;
  }
}
const pointsStore = new PointsStore();
export default pointsStore;





