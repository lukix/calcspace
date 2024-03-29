const MINUTE_IN_MS = 60 * 1000;
const DAY_IN_MS = 24 * 60 * MINUTE_IN_MS;

export const PORT = process.env.PORT || 3001;
export const ORIGIN_REGEXP_PREFIX = 'regexp:';
export const ORIGIN_URL = process.env.ORIGIN_URL || 'http://localhost:3000'; // can be a regexp if prefixed with value of ORIGIN_REGEXP_PREFIX
export const DATABASE_URL =
  process.env.DATABASE_URL || 'postgres://postgres:postgres@postgres:5432/postgres';
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret123';
export const TOKEN_EXPIRATION_DURATION_MS = process.env.TOKEN_EXPIRATION_DURATION_MS
  ? Number(process.env.TOKEN_EXPIRATION_DURATION_MS)
  : 5 * MINUTE_IN_MS;
export const REFRESH_TOKEN_EXPIRATION_DURATION_MS = process.env.REFRESH_TOKEN_EXPIRATION_DURATION_MS
  ? Number(process.env.REFRESH_TOKEN_EXPIRATION_DURATION_MS)
  : 30 * DAY_IN_MS;
export const TOKENS_CLEANUP_THRESHOLD = process.env.TOKENS_CLEANUP_THRESHOLD
  ? Number(process.env.TOKENS_CLEANUP_THRESHOLD)
  : 1000;
const DB_SSL_ENABLED = Boolean(process.env.DB_SSL_ENABLED);

export const SALT_ROUNDS = 14;
export const SSL_DB_CONNECTION_OPTIONS = DB_SSL_ENABLED
  ? {
      ssl: {
        rejectUnauthorized: false,
      },
    }
  : {};
