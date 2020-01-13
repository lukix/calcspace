import bcrypt from 'bcrypt';
import * as yup from 'yup';
import getJwtTokenCookie from '../auth/getNewJwtTokenCookie';
import { SALT_ROUNDS } from '../config';
import authorizationMiddleware from '../auth/authorizationMiddleware';
import validateBodyWithYup from '../shared/validateBodyWithYup';

export default ({ db }) => {
  const usersCollection = db.collection('users');

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
      const user = await usersCollection.findOne({ username });
      if (!user) {
        return AUTH_FAILED_RESPONSE;
      }
      if (!(await bcrypt.compare(password, user.password))) {
        return AUTH_FAILED_RESPONSE;
      }

      const jwtTokenCookie = getJwtTokenCookie(user._id, username);
      res.cookie(
        jwtTokenCookie.name,
        jwtTokenCookie.value,
        jwtTokenCookie.options
      );
      return { response: { username } };
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
          .required(),
        password: yup
          .string()
          .min(6)
          .max(72)
          .required(),
      });
      const validationError = validateBodyWithYup(validationSchema)({ body });
      if (validationError) {
        return validationError;
      }

      const user = await usersCollection.findOne({ username: body.username });
      if (user) {
        return { error: 'Given username is already taken' };
      }
      return null;
    },
    handler: async ({ body }) => {
      const { username, password } = body;
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const user = { username, password: hashedPassword, cards: [] };
      const { insertedId } = await usersCollection.insertOne(user);
      return { status: 200, response: { id: insertedId } };
    },
  };

  const getUsernameAvailability = {
    path: '/username-availability/:username',
    method: 'get',
    handler: async ({ params }) => {
      const user = await usersCollection.findOne({ username: params.username });
      return { response: { isUsernameAvailable: user === null } };
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
    addUser,
    getUsernameAvailability,
    getCurrentlyLoggedInUser,
  ];
};
