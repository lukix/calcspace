const mapHandlerToRoute = handler => async (req, res) => {
  const { status = 200, response } = await handler(req);
  res.status(status);
  res.send(response);
};

export default mapHandlerToRoute;
