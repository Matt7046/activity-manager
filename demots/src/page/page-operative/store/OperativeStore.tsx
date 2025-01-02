import { makeObservable, observable } from 'mobx';
import BaseStore from '../../../general/BaseStore';
import { ActivityI } from '../../page-activity/Activity';

export class OperativeStore extends BaseStore {


  @observable pointsField = 0;
  @observable emailField = '';
  @observable activity = [] as ActivityI[];
  @observable points = 0;

  constructor() {
    super(); // Inizializza la classe base
    makeObservable(this);

  }

  getStore() {
    return this;
  }
  setPoints(points: number) {
    this.points = points;
  }
  setPointsField(pointsField: number) {
    this.pointsField = pointsField;
  }
  setEmailField(emailField: string) {
    this.emailField = emailField;
  }
  setActivity(points: ActivityI[]) {
    this.activity = points;
  }
}
const operativeStore = new OperativeStore();
export default operativeStore;





