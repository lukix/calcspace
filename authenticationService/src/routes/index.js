import bcrypt from 'bcrypt';
import * as yup from 'yup';
import { createToken, createRefreshToken, verifyToken, tokenTypes } from '../auth/jwtTokenUtils';
import { SALT_ROUNDS } from '../config';
import { validateBodyWithYup } from '../shared/express-helpers';

export default ({ dbService }) => {
  const getRefreshToken = {
    path: '/get-refresh-token',
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
      const user = await dbService.getUserByName(username, { withHashedPassword: true });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return AUTH_FAILED_RESPONSE;
      }

      const { token, expirationTime } = createRefreshToken(user.id);
      return { response: { refreshToken: token, expirationTime } };
    },
  };

  const getMainToken = {
    path: '/get-main-token',
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

        const user = await dbService.getUserById(userId);

        if (!user || user.deleted) {
          return AUTH_FAILED_RESPONSE;
        }

        const isTokenBlacklisted = await dbService.isRefreshTokenBlacklisted(refreshToken);

        if (isTokenBlacklisted) {
          return AUTH_FAILED_RESPONSE;
        }

        return { response: { token, expirationTime } };
      } catch (e) {
        console.error(e);
        return AUTH_FAILED_RESPONSE;
      }
    },
  };

  const deactivateToken = {
    path: '/inactive-tokens',
    method: 'post',
    validate: validateBodyWithYup(
      yup.object({
        refreshToken: yup.string().required(),
      })
    ),
    handler: async ({ body }) => {
      const { refreshToken } = body;
      try {
        const { exp } = verifyToken(refreshToken, tokenTypes.REFRESH);
        const expireAt = new Date(exp * 1000).getTime();
        await dbService.addRefreshTokenToTheBlacklist(refreshToken, expireAt);
        return { status: 200 };
      } catch (error) {
        console.error('Adding inactive token failed.');
        console.error(error);
        return {
          status: 400,
          response: { message: 'Invalid refresh token provided' },
        };
      }
    },
  };

  const addUser = {
    path: '/users',
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

      const user = await dbService.dbService.getUserByName(body.username);
      if (user) {
        return { error: 'Given username is already taken' };
      }
      return null;
    },
    handler: async ({ body }) => {
      const { username, password } = body;
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const { id } = await dbService.addUser(username, hashedPassword);
      return { status: 200, response: { id } };
    },
  };

  const getUsernameAvailability = {
    path: '/username-availability/:username',
    method: 'get',
    handler: async ({ params }) => {
      const { username } = params;
      const user = await dbService.getUserByName(username);
      return { response: { isUsernameAvailable: !user } };
    },
  };

  const getAllUsers = {
    path: '/users',
    method: 'get',
    handler: async () => {
      const users = await dbService.getAllUsers();
      return { response: { users } };
    },
  };

  const getUser = {
    path: '/users/:userId',
    method: 'get',
    handler: async ({ params }) => {
      const { userId } = params;
      const user = await dbService.getUserById(userId);
      if (user) {
        return { response: { username: user.name } };
      }
      return { status: 404 };
    },
  };

  const updateUser = {
    path: '/users/:userId',
    method: 'put',
    validate: validateBodyWithYup(
      yup.object({
        password: yup.string().min(6).max(72).required(),
      })
    ),
    handler: async ({ params, body }) => {
      const { userId } = params;
      const { password } = body;

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      await dbService.updateUser(userId, hashedPassword);
    },
  };

  const deleteUser = {
    path: '/users/:userId',
    method: 'delete',
    handler: async ({ params }) => {
      const { userId } = params;
      dbService.deleteUser(userId);
    },
  };

  return [
    getRefreshToken,
    getMainToken,
    deactivateToken,
    addUser,
    getAllUsers,
    getUser,
    getUsernameAvailability,
    updateUser,
    deleteUser,
  ];
};
