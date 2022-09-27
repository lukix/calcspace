const MINUTE_IN_MS = 60 * 1000;
const DAY_IN_MS = 24 * 60 * MINUTE_IN_MS;

export const PORT = process.env.PORT || 3002;
export const DATABASE_URL = process.env.DATABASE_URL || 'http://dynamodb:8000';
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret123';
export const TOKEN_EXPIRATION_DURATION_MS = process.env.TOKEN_EXPIRATION_DURATION_MS
  ? Number(process.env.TOKEN_EXPIRATION_DURATION_MS)
  : 5 * MINUTE_IN_MS;
export const REFRESH_TOKEN_EXPIRATION_DURATION_MS = process.env.REFRESH_TOKEN_EXPIRATION_DURATION_MS
  ? Number(process.env.REFRESH_TOKEN_EXPIRATION_DURATION_MS)
  : 30 * DAY_IN_MS;

export const SALT_ROUNDS = 14;
