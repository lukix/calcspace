const getShops = {
  path: '/',
  method: 'get',
  handler: () => ({
    response: [
      { title: 'item1' },
      { title: 'item2' },
      { title: 'item3' },
      { title: 'item4' },
    ],
  }),
};

export default [getShops];
