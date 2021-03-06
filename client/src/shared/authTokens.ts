import { TOKEN_EXPIRATION_MARGIN_MS } from '../config';

const AUTH_TOKEN_KEY_NAME = 'token';
const AUTH_TOKEN_EXPIRATION_TIME_KEY_NAME = 'authTokenExpirationTime';
const REFRESH_TOKEN_KEY_NAME = 'refreshToken';
const REFRESH_TOKEN_EXPIRATION_TIME_KEY_NAME = 'refreshTokenExpirationTime';

const getTokenMethods = (tokenKeyName, tokenExpirationTimeKeyName) => {
  const getToken = () => localStorage.getItem(tokenKeyName);
  const setToken = (token, tokenExpirationTime) => {
    localStorage.setItem(tokenKeyName, token);
    localStorage.setItem(tokenExpirationTimeKeyName, tokenExpirationTime);
  };
  const clearToken = () => {
    localStorage.removeItem(tokenKeyName);
    localStorage.removeItem(tokenExpirationTimeKeyName);
  };
  const hasValidToken = (marginTimeMs = TOKEN_EXPIRATION_MARGIN_MS) => {
    const tokenExpirationTime = localStorage.getItem(tokenExpirationTimeKeyName);

    if (!tokenExpirationTime) {
      return false;
    }

    return new Date().getTime() + marginTimeMs < Number(tokenExpirationTime);
  };

  return { getToken, setToken, clearToken, hasValidToken };
};

const {
  getToken: getAuthToken,
  setToken: setAuthToken,
  clearToken: clearAuthToken,
  hasValidToken: hasValidAuthToken,
} = getTokenMethods(AUTH_TOKEN_KEY_NAME, AUTH_TOKEN_EXPIRATION_TIME_KEY_NAME);
const {
  getToken: getRefreshToken,
  setToken: setRefreshToken,
  clearToken: clearRefreshToken,
  hasValidToken: hasValidRefreshToken,
} = getTokenMethods(REFRESH_TOKEN_KEY_NAME, REFRESH_TOKEN_EXPIRATION_TIME_KEY_NAME);

const clearTokens = () => {
  clearAuthToken();
  clearRefreshToken();
};

export {
  getAuthToken,
  setAuthToken,
  hasValidAuthToken,
  getRefreshToken,
  setRefreshToken,
  hasValidRefreshToken,
  clearTokens,
};
