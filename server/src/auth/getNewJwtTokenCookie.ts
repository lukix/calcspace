import jwt from 'jsonwebtoken';
import {
  JWT_SECRET_KEY,
  TOKEN_EXPIRATION_DURATION_MS,
  JWT_TOKEN_COOKIE_NAME,
  COOKIE_SAME_SITE,
  COOKIE_SECURE,
} from '../config';

const getNewJwtTokenCookie = (userId, username) => {
  const token = jwt.sign({ userId, username }, JWT_SECRET_KEY, {
    expiresIn: `${TOKEN_EXPIRATION_DURATION_MS}ms`,
  });

  const cookie = {
    name: JWT_TOKEN_COOKIE_NAME,
    value: token,
    options: {
      maxAge: TOKEN_EXPIRATION_DURATION_MS,
      httpOnly: true,
      sameSite: COOKIE_SAME_SITE,
      secure: COOKIE_SECURE,
    },
  };
  return cookie;
};

export default getNewJwtTokenCookie;
