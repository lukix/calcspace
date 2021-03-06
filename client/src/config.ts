export const SOCKETS_URL = process.env.REACT_APP_SOCKETS_URL || 'http://localhost:3001/';
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/';
export const SIGN_OUT_URL = `${API_URL}users/sign-out`;
export const RENEW_TOKEN_URL = `${API_URL}users/renew-token`;
export const TOKEN_EXPIRATION_MARGIN_MS = 10 * 1000;
export const FIRST_REQUEST_REFRESH_TOKEN_EXPIRATION_MARGIN_MS = 8 * 60 * 60 * 1000;
