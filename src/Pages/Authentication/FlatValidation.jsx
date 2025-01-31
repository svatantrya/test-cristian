import {
  validateCityNameField,
  validateStreetNameField,
  validateStreetNumberField,
  validateAreaField,
  validateYearField,
  validateRentField,
  validateDateAvailableField,
} from "../../utilFunctions";

function validateFlatForm(apartment, error) {
  let isValid = true;
  error.city = validateCityNameField(apartment.city);
  error.street = validateStreetNameField(apartment.street);
  error.number = validateStreetNumberField(apartment.number);
  error.area = validateAreaField(apartment.area);
  error.year = validateYearField(apartment.year);
  error.rent = validateRentField(apartment.rent);
  error.available = validateDateAvailableField(apartment.available);

  isValid = !Object.values(error).some((errMsg) => errMsg);
  return isValid;
}

export default validateFlatForm;
