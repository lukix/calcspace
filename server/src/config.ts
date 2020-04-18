export const PORT = process.env.PORT || 3001;
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
export const DB_HOST = process.env.DB_HOST || 'postgres';
export const DB_NAME = process.env.DB_NAME || 'postgres';
export const DB_USER = process.env.DB_USER || 'postgres';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret123';
export const TOKEN_EXPIRATION_DURATION_MS = process.env
  .TOKEN_EXPIRATION_DURATION_MS
  ? Number(process.env.TOKEN_EXPIRATION_DURATION_MS)
  : 30 * 60 * 1000;
export const SALT_ROUNDS = 14;
export const JWT_TOKEN_COOKIE_NAME = 'jwtToken';
export const SIGN_OUT_URL = `${CLIENT_URL}`;
export const COOKIE_SAME_SITE = process.env.COOKIE_SAME_SITE || 'none';
export const COOKIE_SECURE = process.env.COOKIE_SECURE
  ? process.env.COOKIE_SECURE === 'true'
  : false;
