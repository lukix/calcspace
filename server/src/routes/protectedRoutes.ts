import * as yup from 'yup';

export default ({ db }) => {
  // const usersCollection = db.collection('users');

  const getSecretMessage = {
    path: '/',
    method: 'get',
    handler: async ({ body }, res) => {
      return {
        response: 'Super secret message available only for authorized users',
      };
    },
  };

  return [getSecretMessage];
};
