import { BASE_API } from "../constants";
import globals from "../globals";

export const postFetch = async (
  url: string,
  body?: object,
  headers?: object
) => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  return res;
};

export const postFetchSafe = async (
  url: string,
  body?: object,
  headers?: object
) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${globals.accessToken}`,
      ...headers,
    },
    body: JSON.stringify(body),
  });
  return res;
};

export const getFetch = async (url: string, headers?: object) => {
  const res = await fetch(url, {
    method: "GET",
    headers: { ...headers },
  });
  return res;
};

export const getFetchSafe = async (url: string, headers?: object) => {
  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${globals.accessToken}`, ...headers },
  });
  return res;
};

export const ensureTokens = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw Error("No refresh token");
  const { accessToken } = globals;
  if (!accessToken) {
    const res = await getFetch(BASE_API + "auth/refresh", {
      Authorization: `Bearer ${refreshToken}`,
    });
    const json = JSON.parse(await res.text());
    globals.accessToken = json["access_token"];
  }
};
