"use client";
import { I18n, i18n } from "@lingui/core";

import { TypeMessage } from "@/page/page-layout/PageLayout";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { MenuLaterale } from "../../components/ms-drawer/Drawer";
import { SectionName, SectionNameDesc, TypeAlertColor, TypeUser } from "./Constant";
import { getSectionMenuIcon } from "./menuIcons";
export { getSectionMenuIcon } from "./menuIcons";

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

  _id?: string;
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
  emailChild: string;
  type: TypeUser
  emailUserCurrent: string;
  name?: string;
  page?: number;
  size?: number;
  field?: string
}

/** Email account famiglia (genitore), distinta dal tutorato selezionato ({@link UserI.emailUserCurrent}). */
export const getFamilyAccountEmail = (
  user: Pick<UserI, "email" | "emailUserCurrent"> | null | undefined,
): string => {
  if (!user) {
    return "";
  }
  return user.email?.trim() || user.emailUserCurrent?.trim() || "";
};

/** Etichetta utente tutorato / child (nome demo o email). */
export const getUserChildDisplay = (user: UserI | null | undefined): string => {
  if (!user) {
    return "";
  }
  return (
    user.name?.trim() ||
    user.emailChild?.trim() ||
    user.emailUserCurrent?.trim() ||
    user.email?.trim() ||
    ""
  );
};

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


/** Icona titolo / drawer: allineata a {@link sezioniMenuIniziale}. */
export type SectionAnnotazioneOptions = {
  /** Home: modalità demo vs accesso con account */
  demoPanelOpen?: boolean;
  /** About: presenza `_id` in query → modifica attività */
  aboutId?: string | null;
};

/** Chiave i18n per il campo annotazione del layout (traduzione in {@link PageLayout}). */
export const getSectionAnnotazione =(
  path: string | undefined,
  options: SectionAnnotazioneOptions = {}
): string | undefined  => {
  if (path == null || path === '') {
    return undefined;
  }
  switch (path) {
    case SectionName.HOME:
    case SectionName.ROOT:
      return options.demoPanelOpen ? 'annotation_home_demo' : 'annotation_home_account';
    case SectionName.REGISTER:
      return 'annotation_register';
    case SectionName.PERSONALITY:
      return 'annotation_personality';
    case SectionName.POLICY:
      return 'annotation_policy';
    case SectionName.ACTIVITY:
      return 'annotation_activity';
    case SectionName.ABOUT:
      return options.aboutId ? 'annotation_about_edit' : 'annotation_about_new';
    case SectionName.GAMIFICATION:
      return 'annotation_gamification';
    case SectionName.POINTS:
      return 'annotation_points';
    case SectionName.LOG_USER_POINT:
      return 'annotation_log_user_point';
    case SectionName.OPERATIVE:
      return 'annotation_operative';
    case SectionName.FAMILY:
      return 'annotation_family';
    case SectionName.NOTIFICATION:
      return 'annotation_notification';
    case SectionName.SETTINGS:
      return 'annotation_settings';
    default:
      return undefined;
  }
}

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

export const getNotificationParts = (
  message: string,
  i18nInstance: I18n
): { title: string; subText: string } => {
  if (!message) {
    return { title: "", subText: "" };
  }

  let valore = "";
  let key = "";
  let resto = "";

  if (message.includes("?lang?")) {
    const parti = message.split("?lang?");
    valore = parti[0]?.trim() ?? "";
    key = parti[1]?.trim() ?? "";
    resto = parti.slice(2).join("?lang?").trim();
  } else if (message.includes("?")) {
    const parti = message.split("?");
    valore = parti[0]?.trim() ?? "";
    key = parti[1]?.trim() ?? "";
    resto = parti.slice(2).join("?").trim();
  } else {
    return { title: message.trim(), subText: "" };
  }

  const traduzione = key ? i18nInstance._(key) : "";
  const restoInTitle = Boolean(resto && /:\s*$/.test(traduzione));
  const title = [valore, traduzione, restoInTitle ? resto : null].filter(Boolean).join(" ").trim();
  const subText = restoInTitle ? "" : resto;

  return { title, subText };
};

export const getTranslatedNotification = (message: string, i18nInstance: I18n): string => {
  const { title, subText } = getNotificationParts(message, i18nInstance);
  return [title, subText].filter(Boolean).join(" ").trim();
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

type AxiosLikeError = {
  response?: { status?: number; statusText?: string; data?: unknown };
  message?: string;
  code?: string;
};

/** Estrae messaggi utili da errori Axios / body Spring (ResponseDTO o testo). */
export const extractRequestErrorMessages = (error: unknown): string[] => {
  const err = error as AxiosLikeError | undefined;
  const data = err?.response?.data;

  if (data != null) {
    if (typeof data === 'string' && data.trim()) {
      return [data.trim()];
    }
    if (typeof data === 'object') {
      const body = data as Record<string, unknown>;
      if (Array.isArray(body.errors) && body.errors.length > 0) {
        return body.errors.map((e) => String(e));
      }
      if (typeof body.errors === 'string' && body.errors.trim()) {
        return [body.errors.trim()];
      }
      if (body.message != null && String(body.message).trim()) {
        return [String(body.message).trim()];
      }
      if (body.error != null && String(body.error).trim()) {
        return [String(body.error).trim()];
      }
      if (body.detail != null && String(body.detail).trim()) {
        return [String(body.detail).trim()];
      }
      if (body.title != null && String(body.title).trim()) {
        return [String(body.title).trim()];
      }
    }
  }

  const status = err?.response?.status;
  if (status) {
    const statusText = err.response?.statusText?.trim();
    return statusText ? [`HTTP ${status} — ${statusText}`] : [`HTTP ${status}`];
  }

  const msg = err?.message?.trim();
  if (err?.code === 'ECONNABORTED' || msg?.toLowerCase().includes('timeout')) {
    return [msg || i18n._('error_request_timeout')];
  }
  if (msg && msg !== 'Network Error') {
    return [msg];
  }

  return [getServerUnavailableMessage()];
};

/** Alert da mostrare nel dialog dopo un catch su richiesta HTTP. */
export const buildRequestErrorAlert = (error: unknown): TypeMessage => {
  const raw = extractRequestErrorMessages(error);
  const translated = translateApiMessages(raw, i18n);
  return {
    titleMessage: i18n._('error_request_title'),
    typeMessage: TypeAlertColor.ERROR,
    message: translated.length > 0 ? translated : raw,
  };
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

/** Sezione di destinazione dopo login (registrazione per utenti nuovi, altrimenti attività). */
export const getPostLoginSection = (user: UserI): SectionName => {
  const type = Number(user.type);
  if (type === TypeUser.NEW_USER) {
    return SectionName.REGISTER;
  }
  return SectionName.ACTIVITY;
};

export const redirectAfterLogin = (router: AppRouterInstance, user: UserI) => {
  navigateRouting(router, getPostLoginSection(user), {});
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
          icon: getSectionMenuIcon(SectionName.ACTIVITY)
        },
        {
          funzione: null,
          testo: SectionNameDesc.ABOUT(null),
          path: SectionName.ABOUT,

          icon: getSectionMenuIcon(SectionName.ABOUT)
        },
        {
          funzione: null,
          testo: SectionNameDesc.POINTS,
          path: SectionName.POINTS,
          icon: getSectionMenuIcon(SectionName.POINTS)
        },
        {
          funzione: null,
          testo: SectionNameDesc.OPERATIVE,
          path: SectionName.OPERATIVE,
          icon: getSectionMenuIcon(SectionName.OPERATIVE)
        },
      ],
      [
        {
          funzione: null,
          testo: SectionNameDesc.FAMILY,
          path: SectionName.FAMILY,
          icon: getSectionMenuIcon(SectionName.FAMILY)
        },
        {
          funzione: null,
          testo: SectionNameDesc.NOTIFICATION,
          path: SectionName.NOTIFICATION,
          icon: getSectionMenuIcon(SectionName.NOTIFICATION)
        },
        {
          funzione: null,
          testo: SectionNameDesc.SETTINGS,
          path: SectionName.SETTINGS,
          icon: getSectionMenuIcon(SectionName.SETTINGS)
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
          icon: getSectionMenuIcon(SectionName.ACTIVITY)
        },
        {
          funzione: null,
          testo: SectionNameDesc.GAMIFICATION,
          path: SectionName.GAMIFICATION,
          icon: getSectionMenuIcon(SectionName.GAMIFICATION)
        },
        {
          funzione: null,
          testo: SectionNameDesc.POINTS,
          path: SectionName.POINTS,
          icon: getSectionMenuIcon(SectionName.POINTS)
        },
        {
          funzione: null,
          testo: SectionNameDesc.OPERATIVE,
          path: SectionName.OPERATIVE,
          icon: getSectionMenuIcon(SectionName.OPERATIVE)
        },

      ],
      [
        {
          funzione: null,
          testo: SectionNameDesc.NOTIFICATION,
          path: SectionName.NOTIFICATION,
          icon: getSectionMenuIcon(SectionName.NOTIFICATION)
        },
        {
          funzione: null,
          testo: SectionNameDesc.SETTINGS,
          path: SectionName.SETTINGS,
          icon: getSectionMenuIcon(SectionName.SETTINGS)
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


