import { action, makeObservable, observable } from 'mobx';
import BaseStore from '../../../general/structure/BaseStore';

export class FamilyStore extends BaseStore {



  @observable points: number = 0;
  @observable email: string = 'pippo';
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

  @action
  setEmail(email: string) {
    this.email = email
  }
  
  
}
const familyStore = new FamilyStore();
export default familyStore;






