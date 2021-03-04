import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY, TOKEN_EXPIRATION_DURATION_MS } from '../config';

const getNewJwtToken = (userId, username) => {
  const token = jwt.sign({ userId, username }, JWT_SECRET_KEY, {
    expiresIn: `${TOKEN_EXPIRATION_DURATION_MS}ms`,
  });

  return {
    token,
    expirationTime: new Date().getTime() + TOKEN_EXPIRATION_DURATION_MS,
  };
};

export default getNewJwtToken;
