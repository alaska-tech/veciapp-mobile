const ENVIRONMENT = process.env.NODE_ENV ?? "";
const APP_VERSION = "0.0.1";
const APP_NAME = "veciapp";
export const LOGGED_USER_INFO_KEY =
  APP_NAME + " " + APP_VERSION + " " + ENVIRONMENT + " " + "loggedUserInfoKey";
export const JWT_KEY =
  APP_NAME + " " + APP_VERSION + " " + ENVIRONMENT + " " + "JWTKey";
