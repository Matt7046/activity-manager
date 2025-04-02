export enum SectionName {
  POLICY = `privacy-policy`,
  ACTIVITY = `activity`,
  ABOUT = `about`,
  POINTS = `points`,
  OPERATIVE = `operative`,
  FAMILY = `family`,
  REGISTER = `register`,
  ROOT = ''
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

export enum LoginUser {
  USER = 'user',
  PASS = 'qwertyuiop',
}

export enum ServerMessage {
  SERVER_DOWN = "Il server non risponde"
}

export enum TypeAlertColor {
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

export enum ButtonName {
  RED = 'red',
  BLUE = 'blue',
  NEW = "new",
  BACK = "return",
}

