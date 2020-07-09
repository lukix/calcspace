import * as yup from 'yup';
import { validateBodyWithYup } from '../shared/express-helpers';

export default ({ dbClient, sharedFilesManager }) => {
  const getFiles = {
    path: '/',
    method: 'get',
    handler: async ({ user }) => {
      const { rows: files } = await dbClient.query(
        'SELECT id, name FROM files WHERE user_id = $1',
        [user.userId]
      );

      return { response: files };
    },
  };

  const getFileById = {
    path: '/:fileId',
    method: 'get',
    handler: async ({ user, params }) => {
      const { fileId } = params;

      const foundFile = await dbClient
        .query(
          `SELECT
            name,
            code,
            shared_view_enabled as "sharedViewEnabled",
            shared_edit_enabled as "sharedEditEnabled",
            shared_view_id as "sharedViewId",
            shared_edit_id as "sharedEditId"
          FROM files WHERE id = $1 AND user_id = $2`,
          [fileId, user.userId]
        )
        .then(({ rows }) => rows[0]);

      if (!foundFile) {
        return { status: 404 };
      }

      return {
        response: foundFile,
      };
    },
  };

  const addFile = {
    path: '/',
    method: 'post',
    handler: async ({ user }) => {
      const fileName = 'Unnamed file';
      const fileCode = '';
      const newFile = await dbClient
        .query(
          'INSERT INTO files (user_id, name, code) VALUES ($1, $2, $3) RETURNING id, name, code',
          [user.userId, fileName, fileCode]
        )
        .then(({ rows }) => rows[0]);

      return {
        response: newFile,
      };
    },
  };

  const deleteFile = {
    path: '/:fileId',
    method: 'delete',
    handler: async ({ user, params }) => {
      const { fileId } = params;
      await dbClient
        .query('DELETE FROM files WHERE id = $1 AND user_id = $2', [fileId, user.userId])
        .then(({ rows }) => rows[0]);
    },
  };

  const updateFileCode = {
    path: '/:fileId/code',
    method: 'put',
    validate: validateBodyWithYup(
      yup.object({
        code: yup.string(),
      })
    ),
    handler: async ({ body, user, params }) => {
      const { fileId } = params;
      const { code } = body;
      const result = await dbClient.query(
        `UPDATE files SET code = $1 WHERE id = $2 AND user_id = $3
        RETURNING shared_edit_id, shared_edit_enabled, shared_view_id, shared_view_enabled`,
        [code, fileId, user.userId]
      );
      sharedFilesManager.emitChange({
        newCommit: { code, commitId: null },
        fileId,
        sharedEditId:
          result.rows[0] && result.rows[0].shared_edit_enabled
            ? result.rows[0].shared_edit_id
            : null,
        sharedViewId:
          result.rows[0] && result.rows[0].shared_view_enabled
            ? result.rows[0].shared_view_id
            : null,
      });
      return { status: result.rowCount === 0 ? 404 : 200 };
    },
  };

  const updateFileName = {
    path: '/:fileId/name',
    method: 'put',
    validate: validateBodyWithYup(
      yup.object({
        name: yup.string(),
      })
    ),
    handler: async ({ body, user, params }) => {
      const { fileId } = params;
      const { name } = body;
      const result = await dbClient.query(
        'UPDATE files SET name = $1 WHERE id = $2 AND user_id = $3',
        [name, fileId, user.userId]
      );
      return { status: result.rowCount === 0 ? 404 : 200 };
    },
  };

  const updateFileSharedViewEnabledFlag = {
    path: '/:fileId/shared-view-enabled',
    method: 'put',
    validate: validateBodyWithYup(
      yup.object({
        enabled: yup.boolean(),
      })
    ),
    handler: async ({ body, user, params }) => {
      const { fileId } = params;
      const { enabled } = body;
      const result = await dbClient.query(
        'UPDATE files SET shared_view_enabled = $1 WHERE id = $2 AND user_id = $3',
        [enabled, fileId, user.userId]
      );
      return { status: result.rowCount === 0 ? 404 : 200 };
    },
  };

  const updateFileSharedEditEnabledFlag = {
    path: '/:fileId/shared-edit-enabled',
    method: 'put',
    validate: validateBodyWithYup(
      yup.object({
        enabled: yup.boolean(),
      })
    ),
    handler: async ({ body, user, params }) => {
      const { fileId } = params;
      const { enabled } = body;
      const result = await dbClient.query(
        'UPDATE files SET shared_edit_enabled = $1 WHERE id = $2 AND user_id = $3',
        [enabled, fileId, user.userId]
      );
      return { status: result.rowCount === 0 ? 404 : 200 };
    },
  };

  return [
    getFiles,
    getFileById,
    addFile,
    deleteFile,
    updateFileCode,
    updateFileName,
    updateFileSharedViewEnabledFlag,
    updateFileSharedEditEnabledFlag,
  ];
};
