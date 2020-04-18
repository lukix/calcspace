import bcrypt from 'bcrypt';
import * as yup from 'yup';
import getJwtTokenCookie from '../auth/getNewJwtTokenCookie';
import { SALT_ROUNDS, JWT_TOKEN_COOKIE_NAME, SIGN_OUT_URL } from '../config';
import authorizationMiddleware from '../auth/authorizationMiddleware';
import { validateBodyWithYup } from '../shared/express-helpers';

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
    handler: async ({ body }, res) => {
      const AUTH_FAILED_RESPONSE = {
        response: { message: 'Invalid username or password' },
        status: 401,
      };
      const { username, password } = body;
      const user = await dbClient
        .query('SELECT id, password FROM users WHERE name = $1', [username])
        .then(({ rows }) => rows[0]);
      if (!user) {
        return AUTH_FAILED_RESPONSE;
      }
      if (!(await bcrypt.compare(password, user.password))) {
        return AUTH_FAILED_RESPONSE;
      }

      const jwtTokenCookie = getJwtTokenCookie(user.id, username);
      res.cookie(
        jwtTokenCookie.name,
        jwtTokenCookie.value,
        jwtTokenCookie.options
      );
      return { response: { username } };
    },
  };

  const signOut = {
    path: '/sign-out',
    method: 'get',
    handler: async (req, res) => {
      res.clearCookie(JWT_TOKEN_COOKIE_NAME);
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
        .query(
          'INSERT INTO users (name, password) VALUES ($1, $2) RETURNING id',
          [username, hashedPassword]
        )
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
    middlewares: [authorizationMiddleware],
    handler: async ({ user }) => {
      const { username } = user;
      return { response: { username } };
    },
  };

  return [
    authenticate,
    signOut,
    addUser,
    getUsernameAvailability,
    getCurrentlyLoggedInUser,
  ];
};
