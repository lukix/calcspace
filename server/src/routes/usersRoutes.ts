import bcrypt from 'bcrypt';
import * as yup from 'yup';
import { createToken, createRefreshToken, verifyToken, tokenTypes } from '../auth/jwtTokenUtils';
import { SALT_ROUNDS, SIGN_OUT_URL } from '../config';
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
        .query('SELECT id, password FROM users WHERE name = $1', [username])
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

      try {
        const { userId } = verifyToken(refreshToken, tokenTypes.REFRESH);
        const { token, expirationTime } = createToken(userId);

        // TODO: Check if user still exists in the DB
        // TODO: Check refreshToken against blacklist in the DB

        return { response: { token, expirationTime } };
      } catch {
        return { status: 403, response: { message: 'Token verification failed' } };
      }
    },
  };

  const signOut = {
    path: '/sign-out',
    method: 'get',
    handler: async (req, res) => {
      res.redirect(SIGN_OUT_URL);
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
