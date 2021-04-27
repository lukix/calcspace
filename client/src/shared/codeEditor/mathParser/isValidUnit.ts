const isValidUnit = (complexUnitString) => {
  const UNIT_REGEX = /^([A-Za-z]+(\^[1-9]+[0-9]*)?(\/|\*))*([A-Za-z]+(\^(-?[1-9])+[0-9]*)?)$/;
  return complexUnitString.match(UNIT_REGEX) || complexUnitString === '%';
};

export default isValidUnit;
