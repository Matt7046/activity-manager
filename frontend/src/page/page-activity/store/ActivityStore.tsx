import BaseStore from '../../../general/structure/BaseStore';
import { ResponseI } from '../../../general/structure/Utils';
import { ActivityI } from '../Activity';

export class ActivityStore extends BaseStore {
  

  activity : ActivityI[]

  constructor() {
    super(); // Inizializza la classe base
    this.activity =[];
  }


  
  setAllActivity(response: ResponseI) {
    const activity = response.jsonText.map((value: any)=>{
      return {_id : value._id, nome: value.nome, subTesto: value.subTesto};
    })
    this.activity = activity;
  
  }


  setActivityById(_id:string, testo :any) {
      // Trova l'indice dell'elemento con _id uguale
      const rowIndex = this.activity.findIndex((x) => x._id === _id);
    
      if (rowIndex !== -1) {
        // Modifica l'elemento esistente con il nuovo valore
        this.activity[rowIndex] = { ...this.activity[rowIndex], ...testo };
      } else {
        console.error(`Elemento con _id ${_id} non trovato.`);
      }
    }
    

  


  getStore() {
    return this;
  }
}
const activityStore = new ActivityStore();
export default activityStore;





