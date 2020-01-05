const mapHandlerToRoute = handler => async (req, res) => {
  try {
    const { status = 200, response } = await handler(req);
    res.status(status);
    res.send(response);
  } catch (err) {
    res.sendStatus(500);
  }
};

export default mapHandlerToRoute;
