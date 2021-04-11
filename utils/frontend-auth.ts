import jwt from "jsonwebtoken";
const JWT_KEY = "JWT";
export function getToken() {
  try {
    return "eyJraWQiOiJId1RaWGl2S1ZmVWFybDQyK0VkcjY5RmtIQVZNZkkrZ25zOUxSVUVjV29BPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiNHg4UlkyeEYzeFVBMVdzSldkUnNjQSIsInN1YiI6ImZmYWY1ZjQ4LTc3N2UtNGFhZC1iZTE1LWQ2YWIxODRmYmVlNyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9XOFk3NDlMbTgiLCJjb2duaXRvOnVzZXJuYW1lIjoiaGFzaDg4OCIsImdpdmVuX25hbWUiOiJIYXNoIiwiYXVkIjoiMzJlMWx0MTJiZWF1dTZjbGMxMWsyYm4za3MiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTYxODE0NzU2NSwibmFtZSI6Imhhc2htYW4iLCJuaWNrbmFtZSI6Imhhc2htYW4iLCJleHAiOjE2MTgxNTExNjUsImlhdCI6MTYxODE0NzU2NSwiZmFtaWx5X25hbWUiOiJNYW4iLCJlbWFpbCI6ImltbWFhZCtzdGFyd2Fyc2NjZ0BnbWFpbC5jb20ifQ.CnVybJp-1OHWw8tRUGTUBI1KExCk1V9jzYCAjp6_8RxyyjoI4yBQQ_hrWPbqKD9OJZoSRdijst5ckYViGrBDcabc70yKoVFPK1__ubQHSickSyrHNMOvODeDTlQbXc1-aNJmY1qA6e0a1-s6KYNi3EFR2iiSYeNv5CgySzS7QEywwOXxpj2MgrQ5qfrflJJ_hEjxoR8x3U0Kfxl159ueF9_qebPmukUOrY6o4p20BTe24y0X-FwT9hGfbBaev8E9zxccFIKmAlB9yVoJn703_e6tWMcTg8zxWR0UZVw-1FZUcdyq-uygwEcWAWFrMzsc_EvrRML6VSN24VoP-gEOAg&access_token=eyJraWQiOiJcL1QyT1F0SG1QSGRRaVZxeENzSUZYV3VGMGlCYmw5czk1M2E3NlwvQ1NGUXc9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJmZmFmNWY0OC03NzdlLTRhYWQtYmUxNS1kNmFiMTg0ZmJlZTciLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXV0aF90aW1lIjoxNjE4MTQ3NTY1LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9XOFk3NDlMbTgiLCJleHAiOjE2MTgxNTExNjUsImlhdCI6MTYxODE0NzU2NSwidmVyc2lvbiI6MiwianRpIjoiMjEzNjQzODYtMGRhYS00YmNjLTkzYzEtYzY4YTA5ZDY4ZWYxIiwiY2xpZW50X2lkIjoiMzJlMWx0MTJiZWF1dTZjbGMxMWsyYm4za3MiLCJ1c2VybmFtZSI6Imhhc2g4ODgifQ.V5Pznp9YWqyE6XgRPk8L0i9UyoYvKQWzL21AHNubKhV0_y3LzLxb2wMkctZd9uVwOlIxrzyEu1sBr0M7cy_-5HUHH2OznBt64ouDe9xhhozkDIXgn8uPwAf5erMEbXuUpEQEH93R7ngv8jN880F0x2nxgQhBgcPL8mC-WmsnC6-fuVxnu9xC8aJ7nQP7xzCuZ2NEZWMgq38nU0-J8d-Uh42r5isXKbLtYHwOavN6H-WI3Muxbkl7fXFHeJabCAmrGFPcWFg26sknwJCKObNtLwjzpD1DUZY2vSA55Tl_lRZiJULp41WGnWMKdEgLJHZCgMBgUdGHleBlvgJJPf5jLw";
    return localStorage.getItem(JWT_KEY);
  } catch {
    return;
  }
}
export function setToken(token: string) {
  return localStorage.setItem(JWT_KEY, token);
}
export function removeToken() {
  return localStorage.removeItem(JWT_KEY);
}
enum Environment {
  prod = "Prod",
  local = "Local",
}
function getEnvironment(): Environment {
  try {
    if (window.location.origin.includes("localhost")) {
      return Environment.local;
    } else {
      return Environment.prod;
    }
  } catch {
    return Environment.local;
  }
}
export function getSignInUrl() {
  // return process.env.COGNITO_LOGON_URL; // module.exports.serverRuntimeConfig.COGNITO_LOGON_URL;
  return "https://auth.starwarsccg.org/login?client_id=32e1lt12beauu6clc11k2bn3ks&response_type=token&scope=email+openid+profile&redirect_uri=https://deckdb.starwarsccg.org/callback";
}
export function getUserId() {
  const token = getToken();
  if (!token) {
    return;
  }
  const decoded = jwt.decode(token) as { userId: string } | null;
  return decoded && decoded.userId || 1234;
}
