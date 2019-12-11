import nestRoutes from '../nestRoutes';

describe('nestRoutes', () => {
  it("should append suffix to each object's path", () => {
    const routeObjects = [
      { path: '/', method: 'get' },
      { path: '/:id', method: 'post' },
    ];
    const expectedNestedRouteObjects = [
      { path: '/resources/', method: 'get' },
      { path: '/resources/:id', method: 'post' },
    ];

    const actualNestedRouteObjects = nestRoutes('/resources', routeObjects);

    expect(actualNestedRouteObjects).toEqual(expectedNestedRouteObjects);
  });
});
