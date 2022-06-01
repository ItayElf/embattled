export const BASE_URL = `http://${window.location.hostname}:5555/`;
export const BASE_API = BASE_URL + "api/";
export const BASE_WS =
  BASE_URL.replace("https", "wss").replace("http", "ws") + "sockets/";
