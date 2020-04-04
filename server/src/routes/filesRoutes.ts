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
        response: files,
      };
    },
  };

  const addFile = {
    path: '/',
    method: 'post',
    validate: validateBodyWithYup(
      yup.object({
        fileId: yup.string().required(),
      })
    ),
    handler: async ({ user, body }) => {
      const { fileId } = body;
      const newFile = { id: fileId, expressions: [] };
      await usersCollection.updateOne(
        {
          _id: ObjectId(user.userId),
        },
        { $push: { files: { $each: [newFile], $position: 0 } } }
      );
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
        { $pull: { files: { id: fileId } } }
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

  return [getFiles, addFile, deleteFile, updateFile];
};
