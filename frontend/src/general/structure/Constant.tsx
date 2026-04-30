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
  ROOT = ''
}

export const SectionNameDesc = {
  get POLICY() { return i18n._('privacy_policy'); }, // Usa la chiave corretta del tuo JSON
  get ACTIVITY() { return i18n._('attivita'); },
  get GAMIFICATION() { return i18n._('completa_e_guadagna_punti'); },
  get ABOUT() { return i18n._('nuova_attivita'); },
  get POINTS() { return i18n._('sezione_informazioni_utente'); },
  get OPERATIVE() { return i18n._('sezione_operativa'); },
  get FAMILY() { return i18n._('sezione_famiglia'); },
  get REGISTER() { return i18n._('sezione_registrazione'); },
  get NOTIFICATION() { return i18n._('notifiche'); },
  get SETTINGS() { return i18n._('impostazione_profilo'); },
  ROOT: ''
};

export enum StatusUserPoint {
  ACTIVE = 1,
  DISACTIVE = 2
}

export const IMAGE = {
  SERVER: process.env.REACT_APP_IMAGE_SERVER
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

export const StatusNotification = {
  get READ() { return i18n._('read'); }, // Usa la chiave corretta del tuo JSON
  get RECEIVE() { return i18n._('receive'); },
  get NOT_READ() { return i18n._('not_read'); },
  get ALL() { return i18n._('all'); },
  ROOT: ''
};

