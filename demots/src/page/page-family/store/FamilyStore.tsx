import { action, makeObservable, observable } from 'mobx';
import BaseStore from '../../../general/BaseStore';

export class FamilyStore extends BaseStore {



  @observable points: number = 0;

  constructor() {    
    super(); // Inizializza la classe base
    makeObservable(this);

  }
  getStore() {
    return this;
  }
  @action
  setPoints(points: number) {
    this.points = points
  }
}
const familyStore = new FamilyStore();
export default familyStore;






