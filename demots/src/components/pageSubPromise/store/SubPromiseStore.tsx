import { observer } from 'mobx-react';
import BaseStore from '../../general/BaseStore';
import { DTOSubPromise } from '../../dto/DTOSubPromise';

export class SubPromiseStore extends BaseStore {
  

  testo : DTOSubPromise[]

  constructor() {
    super(); // Inizializza la classe base
    this.testo =[];
  }


  
  setAllTesto(response: any) {
    const testo = response.testo.map((value: any)=>{
      return {_id : value._id, nome: value.nome, subTesto: value.subTesto};
    })
    this.testo = testo;
  
  }


  setTestoById(_id:string, testo :any) {
      // Trova l'indice dell'elemento con _id uguale
      const rowIndex = this.testo.findIndex((x) => x._id === _id);
    
      if (rowIndex !== -1) {
        // Modifica l'elemento esistente con il nuovo valore
        this.testo[rowIndex] = { ...this.testo[rowIndex], ...testo };
      } else {
        console.error(`Elemento con _id ${_id} non trovato.`);
      }
    }
    

  


  getStore() {
    return this;
  }
}
const subPromiseStore = new SubPromiseStore();
export default subPromiseStore;





