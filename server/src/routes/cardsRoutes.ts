import { ObjectId } from 'mongodb';
import * as yup from 'yup';
import { validateBodyWithYup } from '../shared/express-helpers';

export default ({ db }) => {
  const usersCollection = db.collection('users');

  const getCards = {
    path: '/',
    method: 'get',
    handler: async ({ user }) => {
      const foundUser = await usersCollection.findOne({
        _id: ObjectId(user.userId),
      });

      if (!foundUser) {
        return { status: 404 };
      }

      const { cards } = foundUser;

      return {
        response: cards,
      };
    },
  };

  const addCard = {
    path: '/',
    method: 'post',
    validate: validateBodyWithYup(
      yup.object({
        cardId: yup.string().required(),
      })
    ),
    handler: async ({ user, body }) => {
      const { cardId } = body;
      const newCard = { id: cardId, expressions: [] };
      await usersCollection.updateOne(
        {
          _id: ObjectId(user.userId),
        },
        { $push: { cards: { $each: [newCard], $position: 0 } } }
      );
    },
  };

  const deleteCard = {
    path: '/:cardId',
    method: 'delete',
    handler: async ({ user, params }) => {
      const { cardId } = params;
      await usersCollection.updateOne(
        {
          _id: ObjectId(user.userId),
        },
        { $pull: { cards: { id: cardId } } }
      );
    },
  };

  const updateCard = {
    path: '/:cardId',
    method: 'put',
    validate: validateBodyWithYup(
      yup.object({
        expressions: yup.array().of(yup.string()),
      })
    ),
    handler: async ({ body, user, params }) => {
      const { cardId } = params;
      const newCard = { ...body, id: cardId };
      const { result } = await usersCollection.updateOne(
        {
          _id: ObjectId(user.userId),
        },
        { $set: { 'cards.$[card]': newCard } },
        { arrayFilters: [{ 'card.id': { $eq: cardId } }] }
      );
      return { status: result.nModified === 0 ? 404 : 200 };
    },
  };

  // const reorderCards = {
  //   path: '/',
  //   method: 'put',
  //   handler: async ({ user, params }) => {
  //     // Save, delete, insert in a new place
  //     // const { cardId } = params;
  //     // await usersCollection.updateOne(
  //     //   {
  //     //     _id: ObjectId(user.userId),
  //     //   },
  //     //   { $pull: { cards: { id: cardId } } }
  //     // );
  //   },
  // };

  return [getCards, addCard, deleteCard, updateCard];
};
