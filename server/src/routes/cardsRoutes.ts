import { ObjectId } from 'mongodb';
import * as yup from 'yup';
import validateBodyWithYup from '../shared/validateBodyWithYup';

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

  return [getCards, addCard, deleteCard];
};
