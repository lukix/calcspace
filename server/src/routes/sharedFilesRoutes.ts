import * as yup from 'yup';
import { v4 as uuid } from 'uuid';
import { validateBodyWithYup } from '../shared/express-helpers';

export default ({ dbClient, io }) => {
  const filesMemory = new Map<string, Array<{ commitId: string; date: Date; code: string }>>();
  let connectedUsers = 0;
  io.on('connection', (socket) => {
    connectedUsers++;
    console.log(`users connected: ${connectedUsers}`);

    socket.on('subscribe-to-file/by-edit-id', (data) => {
      socket.join(`shared/edit/${data.id}`);
    });

    socket.on('subscribe-to-file/by-view-id', (data) => {
      socket.join(`shared/view/${data.id}`);
    });

    socket.on('disconnect', () => {
      connectedUsers--;
      console.log(`users connected: ${connectedUsers}`);
    });
  });

  const getFileBySharedEditId = {
    path: '/edit/:sharedEditId',
    method: 'get',
    handler: async ({ params }) => {
      const { sharedEditId } = params;

      // const fileCommits = filesMemory.get(sharedEditId) || null;
      // if (fileCommits && fileCommits.length > 0) {
      //   const response = fileCommits[fileCommits.length - 1];
      //   return { response };
      // }

      const foundFile = await dbClient // TODO: There is a risk of something being inserted to the Map while requesting DB
        .query(
          `SELECT code, shared_view_id, shared_view_enabled, (user_id is not NULL) as "userManaged"
          FROM files WHERE shared_edit_id = $1 AND shared_edit_enabled = TRUE`,
          [sharedEditId]
        )
        .then(({ rows }) => rows[0]);

      if (!foundFile) {
        return { status: 404 };
      }

      const newCommit = { commitId: uuid(), date: new Date(), code: foundFile.code as string };
      const newFileCommits = [newCommit]; // TODO
      filesMemory.set(sharedEditId, newFileCommits);

      await dbClient.query('UPDATE files SET last_opened = NOW() WHERE shared_edit_id = $1', [
        sharedEditId,
      ]);

      return {
        response: {
          ...newCommit,
          sharedViewId:
            foundFile.shared_view_enabled && !foundFile.userManaged
              ? foundFile.shared_view_id
              : null,
          userManaged: foundFile.userManaged,
        },
      };
    },
  };

  const getFileBySharedViewId = {
    path: '/view/:sharedViewId',
    method: 'get',
    handler: async ({ params }) => {
      const { sharedViewId } = params;

      const foundFile = await dbClient
        .query(
          `SELECT code, (user_id is not NULL) as "userManaged"
          FROM files WHERE shared_view_id = $1 AND shared_view_enabled = TRUE`,
          [sharedViewId]
        )
        .then(({ rows }) => rows[0]);

      if (!foundFile) {
        return { status: 404 };
      }

      await dbClient.query('UPDATE files SET last_opened = NOW() WHERE shared_view_id = $1', [
        sharedViewId,
      ]);

      return {
        response: { code: foundFile.code, commitId: null, userManaged: foundFile.userManaged },
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
      const { code, commitId } = body;

      const fileCommits = filesMemory.get(sharedEditId) || [];
      const commonCommit = fileCommits.find((commit) => commit.commitId === commitId);
      const latestCommit = fileCommits[fileCommits.length - 1];
      const mergeCode = (commonCode, currentCode, incomingCode) => incomingCode; // TODO
      const mergedCode = mergeCode(
        commonCommit ? commonCommit.code : '',
        latestCommit ? latestCommit.code : '',
        code
      );

      const newCommit = { commitId: uuid(), date: new Date(), code: mergedCode };
      const newFileCommits = [...fileCommits, newCommit].slice(-100);
      filesMemory.set(sharedEditId, newFileCommits);

      const result = await dbClient.query(
        'UPDATE files SET code = $1 WHERE shared_edit_id = $2 AND shared_edit_enabled = TRUE RETURNING shared_view_id, shared_view_enabled',
        [mergedCode, sharedEditId]
      );

      io.to(`shared/edit/${sharedEditId}`).emit('change', {
        code: newCommit.code,
        commitId: newCommit.commitId,
      });

      if (result.rows[0] && result.rows[0].shared_view_enabled) {
        io.to(`shared/view/${result.rows[0].shared_view_id}`).emit('change', {
          code: newCommit.code,
          commitId: newCommit.commitId,
        });
      }
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
          `INSERT INTO files (name, code, shared_edit_enabled, shared_view_enabled)
          VALUES ($1, $2, TRUE, TRUE)
          RETURNING shared_edit_id`,
          [fileName, fileCode]
        )
        .then(({ rows }) => rows[0]);

      return {
        response: { sharedEditId: newFile.shared_edit_id },
      };
    },
  };

  return [getFileBySharedEditId, getFileBySharedViewId, updateFileBySharedEditId, addSharedFile];
};
