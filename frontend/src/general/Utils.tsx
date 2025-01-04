import { NavigateFunction } from "react-router-dom";
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
  emailFamily: string;
  type: TypeUser
}

export const verifyForm = (formValues: any) => {

  const errors: any = {};

  // Controlla se i campi sono vuoti o non validi
  Object.keys(formValues).forEach((key) => {
    if (
      formValues[key] === null || // Valore nullo
      formValues[key] === undefined || // Valore non definito
      (typeof formValues[key] === 'string' && (formValues[key] as string)!.trim() === '') || // Stringa vuota
      (typeof formValues[key] === 'number' && isNaN((formValues[key] as number))) // Numero non valido
    ) {
      errors[key] = true; // Imposta errore per il campo
    }
    else {
      errors[key] = false; // Imposta errore per il campo
    }
  });

  return errors;
}

export type FormErrorValues = {
  [key: string]: boolean | undefined;
};


export const getMenuLaterale = (navigate: NavigateFunction, user: UserI): MenuLaterale[][] => {
  const sezioniMenuI = sezioniMenuIniziale(user);
  let menuLaterale: MenuLaterale[][] = [];
  if (user.type === TypeUser.FAMILY || user.type === TypeUser.NEW_USER) {
    menuLaterale = sezioniMenu(sezioniMenuI, navigate, `activity`, {}, 0);
    menuLaterale = sezioniMenu(sezioniMenuI, navigate, `about`, {}, 1);
    menuLaterale = sezioniMenu(sezioniMenuI, navigate, `points`, { email: user.email }, 2);
    menuLaterale = sezioniMenu(sezioniMenuI, navigate, `operative`, { email: user.email }, 3);
    menuLaterale = sezioniMenu(sezioniMenuI, navigate, `family`, { email: user.email }, 4);
  }
  if (user.type === TypeUser.STANDARD) {
    menuLaterale = sezioniMenu(sezioniMenuI, navigate, `activity`, {}, 0);
    menuLaterale = sezioniMenu(sezioniMenuI, navigate, `points`, { email: user.email }, 1);
    menuLaterale = sezioniMenu(sezioniMenuI, navigate, `operative`, { email: user.email }, 2);
  }
  return menuLaterale!;
}

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export enum TypeUser {
  STANDARD = 0,
  FAMILY = 1,
  NEW_USER = 2
}

export enum Alert {
  SERVER_DOWN = "Il server non risponde"
}

