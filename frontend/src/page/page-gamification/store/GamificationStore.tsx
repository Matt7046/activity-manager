import { makeObservable, observable } from 'mobx';
import { VideoI } from '../../../components/ms-video-grid/MsVideoGrid';
import BaseStore from '../../../general/structure/BaseStore';

export class GamificationStore extends BaseStore {

  @observable video = [] as VideoI[];
  @observable points = 0 as number;
  @observable minutes = 0 as number;

  constructor() {
    super(); // Inizializza la classe base
    makeObservable(this);

  }

  getStore() {
    return this;
  }

  addPoints(value: number) {
    this.points += value;
    this.minutes = 0;
  }
  ResetPointsMinutes() {
    this.points = 0;
    this.minutes = 0;
  }

  getPoints() {
    return this.points;
  }

  getMinutes() {
    return this.minutes;
  }

  setVideo(video: VideoI[]) {
    this.video = video;
  }

  getVideo() {
    return this.video;
  }

  setMinutes(minutes: number) {
    this.minutes = minutes;
  }
}
const gamificationStore = new GamificationStore();
export default gamificationStore;





