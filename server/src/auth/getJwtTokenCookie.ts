import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY, TOKEN_EXPIRATION_DURATION_MS } from '../config';

const getJwtTokenCookie = (userId, username) => {
  const token = jwt.sign({ userId, username }, JWT_SECRET_KEY, {
    expiresIn: `${TOKEN_EXPIRATION_DURATION_MS}ms`,
  });

  const cookie = {
    name: 'jwtToken',
    value: token,
    options: {
      maxAge: TOKEN_EXPIRATION_DURATION_MS,
      httpOnly: true,
    },
  };
  return cookie;
};

export default getJwtTokenCookie;
