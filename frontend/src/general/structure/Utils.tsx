"use client";
import { I18n, i18n } from "@lingui/core";

import { TypeMessage } from "@/page/page-layout/PageLayout";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; // Points
import EngineeringIcon from '@mui/icons-material/Engineering';
import GroupIcon from '@mui/icons-material/Group'; // 
import InfoIcon from '@mui/icons-material/Info'; // About
import ListAltIcon from '@mui/icons-material/ListAlt'; // Activity
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings'; // Operative
import StarIcon from '@mui/icons-material/Star';
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { MenuLaterale } from "../../components/ms-drawer/Drawer";
import { SectionName, SectionNameDesc, TypeAlertColor, TypeUser } from "./Constant";

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


export const getMenuLaterale = (navigate: AppRouterInstance, user: UserI): MenuLaterale[][] => {
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

export const getTranslatedNotification = (message: string, i18nInstance: I18n): string => {
  if (!message) return "";

  const parti = message.split('?lang?');
  const valore = parti[0] ? parti[0].trim() : "";
  const key = parti[1] ? parti[1].trim() : "";
  const resto = parti.slice(2).join(' ').trim();

  const traduzione = key ? i18nInstance._(key) : "";
  return [valore, traduzione, resto].filter(Boolean).join(' ').trim();
};

/** Messaggio server non raggiungibile (usa catalogo Lingui, stesso {@code i18n} del provider). */
export const getServerUnavailableMessage = (): string => i18n._('server_unavailable');

/** Lista messaggi API/WS in formato {@code ?lang?chiave?lang?} o testo libero. */
export const translateApiMessages = (errors: string[] | undefined | null, i18nInstance: I18n): string[] => {
  if (!errors?.length) {
    return [];
  }
  return errors.map((e) => getTranslatedNotification(String(e), i18nInstance));
};

export const navigateRouting = (router: AppRouterInstance, path: string, params?: any) => {
  const hasParams = params && typeof params === 'object' && Object.keys(params).length > 0;
  const slug = (path ?? '').toString().replace(/^\/+/, '');
  const base = slug === '' ? '/' : `/${slug}`;
  const isRoot = slug === '';

  const go = (url: string) => {
    if (isRoot) {
      router.replace(url);
    } else {
      router.push(url);
    }
  };

  if (hasParams) {
    const queryString = new URLSearchParams(params).toString();
    const url = base === '/' ? `/?${queryString}` : `${base}?${queryString}`;
    go(url);
  } else {
    go(base);
  }
};
export const sezioniMenuIniziale = (user: UserI): MenuLaterale[][] => {
  if (user === undefined || user === null) {
    return [[]];
  }
  if (user?.type === TypeUser.FAMILY || user.type === TypeUser.NEW_USER) {
    return [
      [
        {
          funzione: null,
          testo: SectionNameDesc.ACTIVITY,
          path: SectionName.ACTIVITY,
          icon: ListAltIcon
        },
        {
          funzione: null,
          testo: SectionNameDesc.ABOUT(null),
          path: SectionName.ABOUT,

          icon: InfoIcon
        },
        {
          funzione: null,
          testo: SectionNameDesc.POINTS,
          path: SectionName.POINTS,
          icon: EmojiEventsIcon
        },
        {
          funzione: null,
          testo: SectionNameDesc.OPERATIVE,
          path: SectionName.OPERATIVE,
          icon: EngineeringIcon
        },
      ],
      [
        {
          funzione: null,
          testo: SectionNameDesc.FAMILY,
          path: SectionName.FAMILY,
          icon: GroupIcon
        },
        {
          funzione: null,
          testo: SectionNameDesc.NOTIFICATION,
          path: SectionName.NOTIFICATION,
          icon: NotificationsIcon
        },
        {
          funzione: null,
          testo: SectionNameDesc.SETTINGS,
          path: SectionName.SETTINGS,
          icon: SettingsIcon
        },
      ]
    ];
  } else {
    return [
      [
        {
          funzione: null,
          testo: SectionNameDesc.ACTIVITY,
          path: SectionName.ACTIVITY,
          icon: ListAltIcon
        },
        {
          funzione: null,
          testo: SectionNameDesc.GAMIFICATION,
          path: SectionName.GAMIFICATION,
          icon: StarIcon
        },
        {
          funzione: null,
          testo: SectionNameDesc.POINTS,
          path: SectionName.POINTS,
          icon: EmojiEventsIcon
        },
        {
          funzione: null,
          testo: SectionNameDesc.OPERATIVE,
          path: SectionName.OPERATIVE,
          icon: EngineeringIcon
        },

      ],
      [
        {
          funzione: null,
          testo: SectionNameDesc.NOTIFICATION,
          path: SectionName.NOTIFICATION,
          icon: NotificationsIcon
        },
        {
          funzione: null,
          testo: SectionNameDesc.SETTINGS,
          path: SectionName.SETTINGS,
          icon: SettingsIcon
        }
      ]
    ];
  }
}

export const showMessage = (setOpen: any, setMessage: any, message?: TypeMessage, onlyError?: boolean) => {
  const messageBE = message?.message ? { message: message?.message, typeMessage: message?.typeMessage, titleMessage: message?.titleMessage } : { titleMessage: "Errore nella richiesta", message: [getServerUnavailableMessage()], typeMessage: 'error' };
  if (!onlyError || onlyError && message?.typeMessage === TypeAlertColor.ERROR) {
    setOpen(true);
  }
  setMessage(messageBE);
}



export const sezioniMenu = (
  sezioni: MenuLaterale[][],
  navigate: AppRouterInstance,
  path: SectionName,
  params: any,
  indice: number
): MenuLaterale[][] => {

  // Calcola la posizione (riga e colonna) per assegnare la funzione
  const numeroRighe = sezioni.length;
  const lunghezzaRiga = sezioni[0].length;

  const riga = Math.floor(indice / lunghezzaRiga);
  const colonna = indice % lunghezzaRiga;

  // Verifica che riga e colonna siano validi e assegna la funzione dinamica
  if (riga < numeroRighe && colonna < sezioni[riga].length) {
    sezioni[riga][colonna].funzione = () => navigateRouting(navigate, path, params);
  }
  return sezioni;
};

// Esempio d'uso:
// const result = estraiTestoKey("15?aggiunti_punti?user@simulated.com");
// console.log(result.punti); // 15
// console.log(result.tipo);  // "aggiunti_punti"


