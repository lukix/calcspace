const validateBodyWithYup = validationSchema => async ({ body }) => {
  try {
    await validationSchema.validate(body, {
      convert: false,
      abortEarly: false,
    });
  } catch (validationError) {
    return validationError;
  }
};

export default validateBodyWithYup;
