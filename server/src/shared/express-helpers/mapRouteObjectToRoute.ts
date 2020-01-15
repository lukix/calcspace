const defaultValidate = () => null;

const mapRouteObjectToRoute = ({
  handler,
  validate = defaultValidate,
}: {
  handler: Function;
  validate?: Function;
}) => async (req, res) => {
  try {
    const validationError = await validate(req);
    if (validationError) {
      res.status(400);
      res.send(validationError);
      return;
    }

    const { status = 200, response } = (await handler(req, res)) || {};
    res.status(status);
    res.send(response);
  } catch (err) {
    console.log(err); // TODO: Decouple - custom logger
    res.status(500);
    res.send({ error: 'Internal server error has occured' });
  }
};

export default mapRouteObjectToRoute;
