import * as yup from 'yup';
import { validateBodyWithYup } from '../shared/express-helpers';

export default ({ dbClient }) => {
  const getFileBySharedEditId = {
    path: '/edit/:sharedEditId',
    method: 'get',
    handler: async ({ params }) => {
      const { sharedEditId } = params;

      const foundFile = await dbClient
        .query('SELECT code FROM files WHERE shared_edit_id = $1 AND shared_edit_enabled = TRUE', [
          sharedEditId,
        ])
        .then(({ rows }) => rows[0]);

      if (!foundFile) {
        return { status: 404 };
      }

      return {
        response: foundFile,
      };
    },
  };

  const updateFileBySharedEditId = {
    path: '/edit/:sharedEditId',
    method: 'put',
    validate: validateBodyWithYup(
      yup.object({
        code: yup.string(),
      })
    ),
    handler: async ({ params, body }) => {
      const { sharedEditId } = params;
      const { code } = body;

      const result = await dbClient.query(
        'UPDATE files SET code = $1 WHERE shared_edit_id = $2 AND shared_edit_enabled = TRUE',
        [code, sharedEditId]
      );

      return { status: result.rowCount === 0 ? 404 : 200 };
    },
  };

  const addSharedFile = {
    path: '/',
    method: 'post',
    handler: async () => {
      const fileName = 'Unnamed shared file';
      const fileCode = '';
      const newFile = await dbClient
        .query(
          'INSERT INTO files (name, code, shared_edit_enabled) VALUES ($1, $2, TRUE) RETURNING shared_edit_id',
          [fileName, fileCode]
        )
        .then(({ rows }) => rows[0]);

      return {
        response: { sharedEditId: newFile.shared_edit_id },
      };
    },
  };

  return [getFileBySharedEditId, updateFileBySharedEditId, addSharedFile];
};
