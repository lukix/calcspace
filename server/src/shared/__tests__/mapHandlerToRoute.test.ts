import mapHandlerToRoute from '../mapHandlerToRoute';

describe('mapHandlerToRoute', () => {
  it('should create a function which sets default status and correct response', async () => {
    const handler = req => ({
      response: `Response: received ${req.body}`,
    });
    const route = mapHandlerToRoute(handler);
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
    const route = mapHandlerToRoute(handler);
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
    const route = mapHandlerToRoute(handler);
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
    const route = mapHandlerToRoute(handler);
    const req = {};
    const res = {
      status: jest.fn(),
      sendStatus: jest.fn(),
      send: jest.fn(),
    };

    await route(req, res);

    expect(res.sendStatus).toHaveBeenCalledTimes(1);
    expect(res.sendStatus).toHaveBeenCalledWith(500);
  });
});
