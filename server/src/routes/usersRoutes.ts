import bcrypt from 'bcrypt';
import * as yup from 'yup';
const SALT_ROUNDS = 14;

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
      const validationSchema = yup.object({
        username: yup
          .string()
          .min(2)
          .max(30)
          .required(),
        password: yup
          .string()
          .min(6)
          .max(72)
          .required(),
      });
      try {
        await validationSchema.validate(body, {
          convert: false,
          abortEarly: false,
        });
      } catch (validationError) {
        return validationError;
      }

      const user = await usersCollection.findOne({ username: body.username });
      if (user) {
        return { error: 'Given username is already taken' };
      }
      return null;
    },
    handler: async ({ body }) => {
      const { username, password } = body;
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const user = { username, password: hashedPassword };
      const { insertedId } = await usersCollection.insertOne(user);
      return { status: 200, response: { id: insertedId } };
    },
  };

  const getUsernameAvailability = {
    path: '/username-availability/:username',
    method: 'get',
    handler: async ({ params }) => {
      const user = await usersCollection.findOne({ username: params.username });
      return { response: { isUsernameAvailable: user === null } };
    },
  };

  return [getUsers, addUser, getUsernameAvailability];
};
