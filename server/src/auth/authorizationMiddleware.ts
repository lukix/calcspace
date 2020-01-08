import jwt from 'jsonwebtoken';
import getNewJwtTokenCookie from './getNewJwtTokenCookie';
import { JWT_SECRET_KEY } from '../config';

const authorizationMiddleware = async (req, res, next) => {
  const { jwtToken } = req.cookies;
  if (!jwtToken) {
    res.sendStatus(403);
    return next();
  }
  try {
    const { userId, username } = jwt.verify(jwtToken, JWT_SECRET_KEY);
    const jwtTokenCookie = getNewJwtTokenCookie(userId, username);
    res.cookie(
      jwtTokenCookie.name,
      jwtTokenCookie.value,
      jwtTokenCookie.options
    );
    req.user = { userId, username };
  } catch (err) {
    return res.sendStatus(403);
  }

  next();
};

export default authorizationMiddleware;
