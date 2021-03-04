import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop: (req, res) => void = () => {};

const createAuthorizationMiddleware = ({ authFailCallback = noop } = {}) => {
  const authorizationMiddleware = async (req, res, next) => {
    const [authType, jwtToken] = (req.headers.authorization || '').split(' ');
    if (!jwtToken) {
      await authFailCallback(req, res);
      return res.sendStatus(403);
    }
    if (authType !== 'Bearer') {
      await authFailCallback(req, res);
      return res.status(403).send({ message: 'Unsupported authorization type' });
    }
    try {
      const { userId, username } = jwt.verify(jwtToken, JWT_SECRET_KEY);

      req.user = { userId, username };
    } catch (err) {
      authFailCallback(req, res);
      return res.sendStatus(403);
    }

    next();
  };

  return authorizationMiddleware;
};

export default createAuthorizationMiddleware;
