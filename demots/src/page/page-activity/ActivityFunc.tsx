import { navigateRouting } from "../../App";



 export const toggleVisibility = (_id: string, handleClickMostraLabel:any) => {
    const element = document.querySelector(`#rowHidden-${_id}`) as HTMLElement;
    const check = element.style.visibility === "hidden";
    // Rimuove il valore inline
    if (check) {
      element.style.visibility = ""; // Rimuove il valore inline

    } else {
      element.style.visibility = "hidden"; // Rimuove il valore inline

    }

    if (check) {
      handleClickMostraLabel(_id)
    }
    return check; // Aggiorna lo stato
  };

  export const openDetail = (_id: string, componentDidMount: any): void => {
    componentDidMount(_id)
  } 

  export const navigateToAboutPage = ( navigate: any): void => {
    navigateRouting(navigate, `about`, {})
  }


