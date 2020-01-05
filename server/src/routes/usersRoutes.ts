import bcrypt from 'bcrypt';
import Joi from '@hapi/joi';

const SALT_ROUNDS = 10;

export default ({ db }) => {
  const usersCollection = db.collection('users');

  const getUsers = {
    path: '/',
    method: 'get',
    handler: async () => {
      const users = await usersCollection.find({}).toArray();
      return { response: users };
    },
  };

  const addUser = {
    path: '/',
    method: 'post',
    validate: async ({ body }) => {
      const validationSchema = Joi.object({
        username: Joi.string()
          .alphanum()
          .min(2)
          .max(30)
          .required(),
        password: Joi.string()
          .min(6)
          .max(72)
          .required(),
      });
      const { error: validationError } = await validationSchema.validate(body, {
        convert: false,
      });
      return validationError;
    },
    handler: async ({ body }) => {
      const { username, password } = body;
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const user = { username, password: hashedPassword };
      const { insertedId } = await usersCollection.insertOne(user);
      return { status: 200, response: { id: insertedId } };
    },
  };

  return [getUsers, addUser];
};
