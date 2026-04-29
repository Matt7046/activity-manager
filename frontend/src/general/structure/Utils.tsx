import { NavigateFunction } from "react-router-dom";
import { MenuLaterale } from "../../components/ms-drawer/Drawer";
import { sezioniMenu, sezioniMenuIniziale } from "../../page/page-home/HomeContent";
import { SectionName, TypeUser } from "./Constant";

export const myDisplayer = ((some: string, value: string) => {
  if (document.getElementById(some)) {
    document.getElementById(some)!.innerHTML = value;
  }
})

export interface ResponseI {

  jsonText: any;
  status: any;
  errors: string[];

}

export interface NotificationI {

  serviceName: string;
  message: string;
  userSender: string;
  userReceiver: Date;
  dateSender: Date;
  status: string;
}

export interface FamilyNotificationI extends NotificationI {

}

export interface UserI {
  _id: string | undefined;
  email: string;
  emailChild:string;
  type: TypeUser
  emailUserCurrent: string;
  page?: number;
  size?: number;
  field?: string
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
  if (user?.type === TypeUser.FAMILY || user?.type === TypeUser.NEW_USER) {
    menuLaterale = sezioniMenu(sezioniMenuI, navigate, SectionName.ACTIVITY, {}, 0);
    menuLaterale = sezioniMenu(sezioniMenuI, navigate, SectionName.ABOUT, {}, 1);
    menuLaterale = sezioniMenu(sezioniMenuI, navigate, SectionName.POINTS, { email: user.email }, 2);
    menuLaterale = sezioniMenu(sezioniMenuI, navigate, SectionName.OPERATIVE, { email: user.email }, 3);
    menuLaterale = sezioniMenu(sezioniMenuI, navigate, SectionName.FAMILY, { email: user.email }, 4);
    menuLaterale = sezioniMenu(sezioniMenuI, navigate, SectionName.NOTIFICATION, { email: user.email }, 5);
    menuLaterale = sezioniMenu(sezioniMenuI, navigate, SectionName.SETTINGS, { email: user.email }, 6);

  }
  if (user?.type === TypeUser.STANDARD) {
    menuLaterale = sezioniMenu(sezioniMenuI, navigate, SectionName.ACTIVITY, {}, 0);
    menuLaterale = sezioniMenu(sezioniMenuI, navigate, SectionName.GAMIFICATION, {}, 1);
    menuLaterale = sezioniMenu(sezioniMenuI, navigate, SectionName.POINTS, { email: user.email }, 2);
    menuLaterale = sezioniMenu(sezioniMenuI, navigate, SectionName.OPERATIVE, { email: user.email }, 3);
    menuLaterale = sezioniMenu(sezioniMenuI, navigate, SectionName.NOTIFICATION, { email: user.email }, 4);
    menuLaterale = sezioniMenu(sezioniMenuI, navigate, SectionName.SETTINGS, { email: user.email }, 5);
  }
  return menuLaterale!;
}


export const getDateStringExtendsFormat = (data: Date): string => {

  return new Date(data).toLocaleString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

export const getDateStringRegularFormat = (data: Date): string => {

  return new Date(data).toLocaleDateString();
}

export const estraiTestoKey = (message: string): { testo: number; key: string } => {
  // Dividiamo la stringa ogni volta che troviamo un '?'
  // Esempio: "15?aggiunti_punti?user@simulated.com" -> ["15", "aggiunti_punti", "user@simulated.com"]
  const parti = message.split('?');

  return {
    // Il primo elemento è il numero (lo convertiamo in number)
    testo: parti[0] ? parseFloat(parti[0]) : 0,
    
    // Il secondo elemento è il tipo/descrizione
    key: parti[1] ? parti[1].trim() : ""
  };
};

// Esempio d'uso:
// const result = estraiTestoKey("15?aggiunti_punti?user@simulated.com");
// console.log(result.punti); // 15
// console.log(result.tipo);  // "aggiunti_punti"


