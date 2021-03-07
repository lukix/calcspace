import bcrypt from 'bcrypt';
import * as yup from 'yup';
import { SALT_ROUNDS } from '../config';
import { deactivateToken } from '../auth/jwtTokenUtils';
import { validateBodyWithYup } from '../shared/express-helpers';

export default ({ dbClient }) => {
  const changePassword = {
    path: '/password',
    method: 'put',
    validate: validateBodyWithYup(
      yup.object({
        currentPassword: yup.string().required(),
        newPassword: yup.string().min(6).max(72).required(),
      })
    ),
    handler: async ({ body, user: { userId } }) => {
      const { currentPassword, newPassword } = body;
      const user = await dbClient
        .query('SELECT id, password FROM users WHERE id = $1', [userId])
        .then(({ rows }) => rows[0]);

      const AUTH_FAILED_RESPONSE = {
        response: { message: 'Invalid current password' },
        status: 401,
      };

      if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
        return AUTH_FAILED_RESPONSE;
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
      await dbClient.query('UPDATE users SET password = $1 WHERE id = $2', [
        hashedNewPassword,
        userId,
      ]);
    },
  };

  const deleteAccount = {
    path: '/account',
    method: 'delete',
    validate: validateBodyWithYup(
      yup.object({
        password: yup.string().required(),
      })
    ),
    handler: async ({ body, authToken, user: { userId } }) => {
      const { password } = body;
      const user = await dbClient
        .query('SELECT password FROM users WHERE id = $1', [userId])
        .then(({ rows }) => rows[0]);

      const AUTH_FAILED_RESPONSE = {
        response: { message: 'Invalid current password' },
        status: 401,
      };

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return AUTH_FAILED_RESPONSE;
      }

      await dbClient.query('DELETE FROM files WHERE user_id = $1', [userId]);
      await dbClient.query('UPDATE users SET deleted = TRUE WHERE id = $1', [userId]);
      deactivateToken(authToken.token, authToken.exp);
    },
  };

  return [changePassword, deleteAccount];
};
