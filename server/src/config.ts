export const PORT = process.env.PORT || 3001;
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
export const DATABASE_URL =
  process.env.DATABASE_URL || 'postgres://postgres:postgres@postgres:5432/postgres';
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret123';
export const TOKEN_EXPIRATION_DURATION_MS = process.env.TOKEN_EXPIRATION_DURATION_MS
  ? Number(process.env.TOKEN_EXPIRATION_DURATION_MS)
  : 48 * 60 * 60 * 1000;
export const TOKEN_RENEW_AFTER_MS = process.env.TOKEN_RENEW_AFTER_MS
  ? Number(process.env.TOKEN_RENEW_AFTER_MS)
  : 5 * 60 * 1000;
export const SALT_ROUNDS = 14;
export const SIGN_OUT_URL = `${CLIENT_URL}`;
