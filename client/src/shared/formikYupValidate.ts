const formikYupValidate = async (validationSchema, values) => {
  try {
    await validationSchema.validate(values, {
      convert: false,
      abortEarly: false,
    });
  } catch (validationError) {
    return validationError.inner.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.path]: curr.message,
      }),
      {}
    );
  }
  return {};
};

export default formikYupValidate;
