import jwt from 'jsonwebtoken';
import {
  JWT_SECRET_KEY,
  TOKEN_EXPIRATION_DURATION_MS,
  REFRESH_TOKEN_EXPIRATION_DURATION_MS,
} from '../config';

export const tokenTypes = {
  MAIN: 'main',
  REFRESH: 'refresh_v1',
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
