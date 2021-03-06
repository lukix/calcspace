import jwt from 'jsonwebtoken';
import {
  JWT_SECRET_KEY,
  TOKEN_EXPIRATION_DURATION_MS,
  REFRESH_TOKEN_EXPIRATION_DURATION_MS,
  TOKENS_CLEANUP_THRESHOLD,
} from '../config';

const inactiveTokens = new Map<string, number>();

export const tokenTypes = {
  MAIN: 'main',
  REFRESH: 'refresh_v1',
};

const cleanUpExpiredTokens = () => {
  const now = new Date().getTime();
  Array.from(inactiveTokens.entries()).forEach(([token, expireAt]) => {
    if (expireAt <= now) {
      inactiveTokens.delete(token);
    }
  });
  console.log(`Inactive tokens left after cleanup: ${inactiveTokens.size}`);
};

export const deactivateToken = (token, expireAt) => {
  inactiveTokens.set(token, expireAt * 1000);
  if (inactiveTokens.size > TOKENS_CLEANUP_THRESHOLD) {
    cleanUpExpiredTokens();
  }
};

export const verifyToken = (jwtToken, expectedType) => {
  const { type, ...payload } = jwt.verify(jwtToken, JWT_SECRET_KEY);
  if (type !== expectedType) {
    throw new Error('Incorrect token type');
  }
  if (inactiveTokens.has(jwtToken)) {
    throw new Error('Token has been deactivated');
  }
  return payload;
};

export const createToken = (userId) => {
  const token = jwt.sign({ userId, type: tokenTypes.MAIN }, JWT_SECRET_KEY, {
    expiresIn: `${TOKEN_EXPIRATION_DURATION_MS}ms`,
  });

  return {
    token,
    expirationTime: new Date().getTime() + TOKEN_EXPIRATION_DURATION_MS,
  };
};

export const createRefreshToken = (userId) => {
  const token = jwt.sign({ userId, type: tokenTypes.REFRESH }, JWT_SECRET_KEY, {
    expiresIn: `${REFRESH_TOKEN_EXPIRATION_DURATION_MS}ms`,
  });

  return {
    token,
    expirationTime: new Date().getTime() + REFRESH_TOKEN_EXPIRATION_DURATION_MS,
  };
};
