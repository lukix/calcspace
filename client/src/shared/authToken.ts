const TOKEN_KEY_NAME = 'token';
const TOKEN_EXPIRATION_TIME_KEY_NAME = 'tokenExpirationTime';

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY_NAME);

export const setAuthToken = ({ token, tokenExpirationTime }) => {
  localStorage.setItem(TOKEN_KEY_NAME, token);
  localStorage.setItem(TOKEN_EXPIRATION_TIME_KEY_NAME, tokenExpirationTime);
};

export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY_NAME);
  localStorage.removeItem(TOKEN_EXPIRATION_TIME_KEY_NAME);
};

export const hasValidAuthToken = () => {
  const tokenExpirationTime = localStorage.getItem(TOKEN_EXPIRATION_TIME_KEY_NAME);

  if (!tokenExpirationTime) {
    return false;
  }

  return new Date().getTime() < Number(tokenExpirationTime);
};
