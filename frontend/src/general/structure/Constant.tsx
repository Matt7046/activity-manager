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
  NOTIFICATION = `Notification`,
  ROOT = ''
}


export enum SectionNameDesc {
  POLICY = `privacy-policy`,
  ACTIVITY = `Attività`,
  GAMIFICATION =  `Sfide e premi`,
  ABOUT = `Nuova attività`,
  POINTS = `Informazioni utente`,
  OPERATIVE = `Operatività`,
  FAMILY = `Famiglia`,
  REGISTER = `Registazione`,
  NOTIFICATION = `Notifiche`,
  ROOT = ''
}


export enum IMAGE {
  SERVER = 'https://res.cloudinary.com/dzxtjigpc/image/'
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
  SEND = 'SEND',
  NOT_READ = "NOT_READ",
  ALL = "ALL"
}

