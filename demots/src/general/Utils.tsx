import { NavigateFunction, useNavigate } from "react-router-dom";
import { sezioniMenu, sezioniMenuIniziale } from "../App";
import { MenuLaterale } from "../components/msdrawer/Drawer";

export const myDisplayer = ((some: string, value: string) => {
  if (document.getElementById(some)) {
    document.getElementById(some)!.innerHTML = value;
  }
})

export interface ResponseI {

  testo: any;
  status: any;
  errors: string[];

}

export interface UserI {
  _id: string | undefined;
  email: string;
}

export const getMenuLaterale = (navigate: NavigateFunction, user: UserI): MenuLaterale[][] => {
  let menuLaterale = sezioniMenu(sezioniMenuIniziale, navigate, `activity`, {}, 0);
  menuLaterale = sezioniMenu(sezioniMenuIniziale, navigate, `about`, {}, 1);
  menuLaterale = sezioniMenu(sezioniMenuIniziale, navigate, `points`, { email: user.email }, 2);
  menuLaterale = sezioniMenu(sezioniMenuIniziale, navigate, `operative`, { email: user.email }, 3);
  return menuLaterale;
}

