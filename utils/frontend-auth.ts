import jwt from "jsonwebtoken";
const JWT_KEY = "JWT";
export function getToken() {
  try {
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
  return decoded && decoded.userId;
}
