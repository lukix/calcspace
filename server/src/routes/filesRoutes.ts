import { ObjectId } from 'mongodb';
import * as yup from 'yup';
import { validateBodyWithYup } from '../shared/express-helpers';

export default ({ db }) => {
  const usersCollection = db.collection('users');

  const getFiles = {
    path: '/',
    method: 'get',
    handler: async ({ user }) => {
      const foundUser = await usersCollection.findOne({
        _id: ObjectId(user.userId),
      });

      if (!foundUser) {
        return { status: 404 };
      }

      const { files } = foundUser;

      return {
        response: files.map((file) => ({ id: file._id, name: file.name })),
      };
    },
  };

  const getFileById = {
    path: '/:fileId',
    method: 'get',
    handler: async ({ user, params }) => {
      const { fileId } = params;
      const foundUser = await usersCollection.findOne({
        _id: ObjectId(user.userId),
      });

      if (!foundUser) {
        return { status: 404 };
      }

      const { files } = foundUser;
      const foundFile = files.find(({ _id }) => _id.toString() === fileId);

      if (!foundFile) {
        return { status: 404 };
      }

      return {
        response: { code: foundFile.code, id: foundFile.id },
      };
    },
  };

  const addFile = {
    path: '/',
    method: 'post',
    handler: async ({ user }) => {
      const newFile = { _id: ObjectId(), name: 'Unnamed file', code: '' };
      await usersCollection.updateOne(
        {
          _id: ObjectId(user.userId),
        },
        { $push: { files: { $each: [newFile], $position: 0 } } }
      );
      return {
        response: { id: newFile._id, name: newFile.name, code: newFile.code },
      };
    },
  };

  const deleteFile = {
    path: '/:fileId',
    method: 'delete',
    handler: async ({ user, params }) => {
      const { fileId } = params;
      await usersCollection.updateOne(
        {
          _id: ObjectId(user.userId),
        },
        { $pull: { files: { _id: ObjectId(fileId) } } }
      );
    },
  };

  const updateFile = {
    path: '/:fileId',
    method: 'put',
    validate: validateBodyWithYup(
      yup.object({
        expressions: yup.array().of(yup.string()),
      })
    ),
    handler: async ({ body, user, params }) => {
      const { fileId } = params;
      const newFile = { ...body, id: fileId };
      const { result } = await usersCollection.updateOne(
        {
          _id: ObjectId(user.userId),
        },
        { $set: { 'files.$[file]': newFile } },
        { arrayFilters: [{ 'file.id': { $eq: fileId } }] }
      );
      return { status: result.nModified === 0 ? 404 : 200 };
    },
  };

  return [getFiles, getFileById, addFile, deleteFile, updateFile];
};
