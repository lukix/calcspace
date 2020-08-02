import jwt from 'jsonwebtoken';
import getNewJwtTokenCookie from './getNewJwtTokenCookie';
import { JWT_SECRET_KEY, JWT_TOKEN_COOKIE_NAME, TOKEN_RENEW_AFTER_MS } from '../config';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

const createAuthorizationMiddleware = ({ authFailCallback = noop } = {}) => {
  const authorizationMiddleware = async (req, res, next) => {
    const jwtToken = req.cookies[JWT_TOKEN_COOKIE_NAME];
    if (!jwtToken) {
      await authFailCallback();
      return res.sendStatus(403);
    }
    try {
      const { userId, username, iat: issuedAtTime } = jwt.verify(jwtToken, JWT_SECRET_KEY);

      const shouldRenewToken = new Date().getTime() - issuedAtTime * 1e3 > TOKEN_RENEW_AFTER_MS;
      if (shouldRenewToken) {
        const jwtTokenCookie = getNewJwtTokenCookie(userId, username);
        res.cookie(jwtTokenCookie.name, jwtTokenCookie.value, jwtTokenCookie.options);
      }

      req.user = { userId, username };
    } catch (err) {
      authFailCallback();
      return res.sendStatus(403);
    }

    next();
  };

  return authorizationMiddleware;
};

export default createAuthorizationMiddleware;
