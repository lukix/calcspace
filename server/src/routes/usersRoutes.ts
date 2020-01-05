import bcrypt from 'bcrypt';

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
    // TODO: bodyValidationSchema: {},
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
