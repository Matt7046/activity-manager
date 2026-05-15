"use client";
import { i18n } from "@lingui/core";



export enum SectionName {
  POLICY = `privacy-policy`,
  ACTIVITY = `activity`,
  GAMIFICATION = `gamification`,
  ABOUT = `about`,
  POINTS = `points`,
  OPERATIVE = `operative`,
  FAMILY = `family`,
  REGISTER = `register`,
  HOME = 'home',
  NOTIFICATION = `notification`,
  SETTINGS = `settings`,
  PERSONALITY = 'personality',
  PRIVACY = 'privacy',
  LOG_USER_POINT = `log-user-point`,
  ROOT = ''
}

/** Pagine accessibili senza utente valorizzato (login / landing / policy). */
export const PUBLIC_SECTION_PATHS = new Set<string>([
  SectionName.ROOT,
  SectionName.HOME,
  SectionName.REGISTER,
  SectionName.PERSONALITY,
  SectionName.POLICY,
]);

export const SectionNameDesc = {
  get POLICY() { return i18n._('privacy_policy'); }, // Usa la chiave corretta del tuo JSON
  get ACTIVITY() { return i18n._('lista_attivita'); },
  get GAMIFICATION() { return i18n._('completa_e_guadagna_punti'); },
  ABOUT(_id: string | null) {
    return _id ? i18n._('attivita') : i18n._('nuova_attivita');
  }, get POINTS() { return i18n._('sezione_informazioni_utente'); },
  get OPERATIVE() { return i18n._('sezione_operativa'); },
  get FAMILY() { return i18n._('sezione_famiglia'); },
  get REGISTER() { return i18n._('sezione_registrazione'); },
  get NOTIFICATION() { return i18n._('notifiche'); },
  get SETTINGS() { return i18n._('impostazione_profilo'); },
  get PERSONALITY() { return i18n._('notifiche'); },
  get PRIVACY() { return i18n._('impostazione_profilo'); },
  get ROOT() { return i18n._('home'); },

};

export enum StatusUserPoint {
  ACTIVE = 1,
  DISACTIVE = 2
}

export const IMAGE = {
  SERVER: process.env.NEXT_PUBLIC_IMAGE_SERVER
}

export const CLIENT_GOOGLE = {
  SERVER: process.env.NEXT_PUBLIC_CLIENT_GOOGLE_ID
}

export const CLIENT_GITHUB = {
  SERVER: process.env.NEXT_PUBLIC_CLIENT_GITHUB_ID
}


/** Path OAuth GitHub (deve coincidere con “Authorization callback URL” su GitHub, es. …/home). */
const GITHUB_OAUTH_CALLBACK_PATH = "/home";

/**
 * Redirect URI verso GitHub: in produzione usa `NEXT_PUBLIC_GITHUB_OAUTH_REDIRECT_URI`.
 * In locale (localhost / 127.0.0.1), se la variabile è vuota, usa `window.location.origin` + `/home`
 * (stesso path del `useEffect` su Home che inoltra `code` al popup opener).
 * Su GitHub OAuth App vanno registrate tutte le URL che usi (es. …:3000/home e …:3001/home).
 */
export const getGitHubOAuthRedirectUri = (): string | undefined => {
  const fromEnv = process.env.NEXT_PUBLIC_GITHUB_OAUTH_REDIRECT_URI?.trim();
  if (fromEnv) {
    return fromEnv;
  }
  if (typeof window === "undefined") {
    return undefined;
  }
  const { hostname } = window.location;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return `${window.location.origin}${GITHUB_OAUTH_CALLBACK_PATH}`;
  }
    if (hostname === "activity-manager.colorsdev.tech" || hostname === "173.212.220.20") {
    return `${window.location.origin}${GITHUB_OAUTH_CALLBACK_PATH}`;
  }
  return undefined;
};

/** Facebook Login: App ID pubblico (SDK + Graph). */
export const CLIENT_FACEBOOK = {
  APP_ID: process.env.NEXT_PUBLIC_CLIENT_FACEBOOK_APP_ID,
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

export enum ServerMessage {
  SERVER_DOWN = "Il server non risponde"
}

export enum TypeAlertColor {
  SUCCESS = 'SUCCESS',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR'
}

export enum ButtonName {
  RED = 'red',
  BLUE = 'blue',
  NEW = "new",
  BACK = "return",
}

export enum StatusNotification {
  READ = 'READ',
  RECEIVE = 'RECEIVE',
  NOT_READ = "NOT_READ",
  ALL = "ALL",
}

export const StatusNotificationTranslate = {

  get READ() { return i18n._('read'); }, // Usa la chiave corretta del tuo JSON
  get RECEIVE() { return i18n._('receive'); },
  get NOT_READ() { return i18n._('not_read'); },
  get ALL() { return i18n._('all'); },
};


export const STORAGE_KEY = 'activity-manager-theme';



