import {
  validateFirstNameField,
  validateLastNameField,
  validateEmailField,
  validatePasswordField,
  validateSamePasswordField,
  validateBirthDateField,
} from "../../utilFunctions";

const ValidateForm = (isNew, user, error) => {
  let isValid = true;
  error.firstName = validateFirstNameField(user.firstName);
  error.lastName = validateLastNameField(user.lastName);
  error.email = validateEmailField(user.email);
  if (isNew) {
    error.password = validatePasswordField(user.password);
    error.samePassword = validateSamePasswordField(
      user.password,
      user.samePassword
    );
  }

  error.birthDate = validateBirthDateField(user.birthDate);
  isValid = !Object.values(error).some((errMsg) => errMsg);
  return isValid;
};

export default ValidateForm;
