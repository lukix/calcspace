import mapRouteObjectToRoute from '../mapRouteObjectToRoute';

describe('mapRouteObjectToRoute', () => {
  it('should create a function which sets default status and correct response', async () => {
    const handler = req => ({
      response: `Response: received ${req.body}`,
    });
    const route = mapRouteObjectToRoute({ handler });
    const req = { body: 'body' };
    const res = {
      status: jest.fn(),
      send: jest.fn(),
    };

    await route(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith('Response: received body');
  });

  it('should work with async handlers', async () => {
    const handler = () => Promise.resolve({ response: 'async response' });
    const route = mapRouteObjectToRoute({ handler });
    const req = {};
    const res = {
      status: jest.fn(),
      send: jest.fn(),
    };

    await route(req, res);

    expect(res.send).toHaveBeenCalledTimes(1);
  });

  it('should create a function which sets correct status', async () => {
    const handler = () => ({ status: 418, response: 'response' });
    const route = mapRouteObjectToRoute({ handler });
    const req = {};
    const res = {
      status: jest.fn(),
      send: jest.fn(),
    };

    await route(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(418);
  });

  it('should sent status 500 when handler throws an error', async () => {
    const handler = () => {
      throw new Error('Error');
    };
    const route = mapRouteObjectToRoute({ handler });
    const req = {};
    const res = {
      status: jest.fn(),
      send: jest.fn(),
    };

    await route(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('should create a function which sets status 200 when validation passes', async () => {
    const handler = req => ({});
    const validate = req => (req.body.x ? null : new Error('x is required'));
    const route = mapRouteObjectToRoute({ handler, validate });
    const req = { body: { x: 'non empty value' } };
    const res = {
      status: jest.fn(),
      send: jest.fn(),
    };

    await route(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should create a function which sets status 400 when validation fails', async () => {
    const handler = req => ({});
    const validate = req => (req.body.x ? null : { error: 'x is required' });
    const route = mapRouteObjectToRoute({ handler, validate });
    const req = { body: {} };
    const res = {
      status: jest.fn(),
      send: jest.fn(),
    };

    await route(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith({ error: 'x is required' });
  });
});
