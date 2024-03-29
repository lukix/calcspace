import bcrypt from 'bcrypt';
import * as yup from 'yup';
import {
  createToken,
  createRefreshToken,
  verifyToken,
  deactivateToken,
  tokenTypes,
} from '../auth/jwtTokenUtils';
import { SALT_ROUNDS } from '../config';
import createAuthorizationMiddleware from '../auth/authorizationMiddleware';
import { validateBodyWithYup } from '../shared/express-helpers';

const truncateUserAgent = (userAgent) => {
  const maxLength = 200;
  if (!userAgent) {
    return userAgent;
  }
  return userAgent.length > maxLength ? `${userAgent.substring(0, maxLength - 3)}...` : userAgent;
};

export default ({ dbClient }) => {
  const authenticate = {
    path: '/authenticate',
    method: 'post',
    validate: validateBodyWithYup(
      yup.object({
        username: yup.string().required(),
        password: yup.string().required(),
      })
    ),
    handler: async ({ body }) => {
      const AUTH_FAILED_RESPONSE = {
        response: { message: 'Invalid username or password' },
        status: 401,
      };
      const { username, password } = body;
      const user = await dbClient
        .query('SELECT id, password FROM users WHERE deleted is FALSE AND name = $1', [username])
        .then(({ rows }) => rows[0]);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return AUTH_FAILED_RESPONSE;
      }

      const { token, expirationTime } = createRefreshToken(user.id);
      return { response: { token, expirationTime } };
    },
  };

  const renewToken = {
    path: '/renew-token',
    method: 'post',
    validate: validateBodyWithYup(
      yup.object({
        refreshToken: yup.string().required(),
      })
    ),
    handler: async ({ body }) => {
      const { refreshToken } = body;

      const AUTH_FAILED_RESPONSE = {
        status: 403,
        response: { message: 'Token verification failed' },
      };

      try {
        const { userId } = verifyToken(refreshToken, tokenTypes.REFRESH);
        const { token, expirationTime } = createToken(userId);

        const user = await dbClient
          .query('SELECT id FROM users WHERE deleted is FALSE AND id = $1', [userId])
          .then(({ rows }) => rows[0]);

        if (!user) {
          return AUTH_FAILED_RESPONSE;
        }

        const blackListedToken = await dbClient
          .query('SELECT id FROM inactive_refresh_tokens WHERE token = $1', [refreshToken])
          .then(({ rows }) => rows[0]);

        if (blackListedToken) {
          return AUTH_FAILED_RESPONSE;
        }

        return { response: { token, expirationTime } };
      } catch {
        return AUTH_FAILED_RESPONSE;
      }
    },
  };

  const signOut = {
    path: '/sign-out',
    method: 'post',
    middlewares: [createAuthorizationMiddleware()],
    validate: validateBodyWithYup(
      yup.object({
        refreshToken: yup.string().required(),
      })
    ),
    handler: async ({ body, authToken }) => {
      const { refreshToken } = body;
      try {
        const { exp } = verifyToken(refreshToken, tokenTypes.REFRESH);
        const expireAt = new Date(exp * 1000);
        await dbClient.query(
          'INSERT INTO inactive_refresh_tokens (token, expire_at) VALUES ($1, $2)',
          [refreshToken, expireAt]
        );
        deactivateToken(authToken.token, authToken.exp);
        return { status: 200 };
      } catch (error) {
        console.error('LOGOUT ERROR');
        console.error(error);
        return {
          status: 400,
          response: { message: 'Invalid refresh token provided' },
        };
      }
    },
  };

  const addUser = {
    path: '/',
    method: 'post',
    validate: async ({ body }) => {
      const validationSchema = yup.object({
        username: yup
          .string()
          .min(2)
          .max(30)
          .required()
          .test(
            'leading-trailing-spaces',
            'Leading and trailing spaces are not allowed',
            (value) => (value || '').trim() === value
          ),
        password: yup.string().min(6).max(72).required(),
      });
      const validationError = validateBodyWithYup(validationSchema)({ body });
      if (validationError) {
        return validationError;
      }

      const user = await dbClient
        .query('SELECT id FROM users WHERE name = $1', [body.username])
        .then(({ rows }) => rows[0]);
      if (user) {
        return { error: 'Given username is already taken' };
      }
      return null;
    },
    handler: async ({ body }) => {
      const { username, password } = body;
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const {
        id,
      } = await dbClient
        .query('INSERT INTO users (name, password) VALUES ($1, $2) RETURNING id', [
          username,
          hashedPassword,
        ])
        .then(({ rows }) => rows[0]);
      return { status: 200, response: { id } };
    },
  };

  const getUsernameAvailability = {
    path: '/username-availability/:username',
    method: 'get',
    handler: async ({ params }) => {
      const { username } = params;
      const user = await dbClient
        .query('SELECT id FROM users WHERE name = $1', [username])
        .then(({ rows }) => rows[0]);
      return { response: { isUsernameAvailable: !user } };
    },
  };

  const getCurrentlyLoggedInUser = {
    path: '/logged-in',
    method: 'get',
    middlewares: [
      createAuthorizationMiddleware({
        authFailCallback: (req) => {
          const userAgent = req.get('User-Agent');
          const truncatedUserAgent = truncateUserAgent(userAgent);
          dbClient.query(`INSERT INTO stats (action, user_agent) VALUES ('LOAD_APP', $1)`, [
            truncatedUserAgent,
          ]);
        },
      }),
    ],
    handler: async (req) => {
      const { userId } = req.user;
      const userAgent = req.get('User-Agent');
      const truncatedUserAgent = truncateUserAgent(userAgent);
      const user = await dbClient
        .query(`SELECT name FROM users WHERE id = $1`, [userId])
        .then(({ rows }) => rows[0]);
      await dbClient.query(
        `INSERT INTO stats (action, user_agent, user_id) VALUES ('LOAD_APP', $1, $2)`,
        [truncatedUserAgent, userId]
      );
      if (user) {
        return { response: { username: user.name } };
      }
      return { status: 404 };
    },
  };

  return [
    authenticate,
    renewToken,
    signOut,
    addUser,
    getUsernameAvailability,
    getCurrentlyLoggedInUser,
  ];
};
