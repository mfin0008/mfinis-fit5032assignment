const MAX_NAME_LENGTH = 10;
const getEmptyErrorMessage = (fieldName) => {
  return `Please provide a ${fieldName}`;
}

export const validateRequiredField = (nameValue, fieldName, fieldDesc, errors, blur) => {
  if (!blur) {
    errors[fieldName] = null;
    return true;
  }
  if (!nameValue) {
    errors[fieldName] = getEmptyErrorMessage(fieldDesc);
    console.log(errors);
    return false;
  }
  return true;
}

export const validateEmail = (email, blur, errors) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!blur) {
    errors.email = null;
    return true;
  }

  if (!email || !regex.test(email)) {
    errors.email = getEmptyErrorMessage('valid Email Address');
    return false;
  }

  return true;
}

export const validatePassword = (password, blur, errors) => {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!blur) {
    errors.password = null;
    return true;
  }

  if (password.length < minLength) {
    errors.password = `Password must be at least ${minLength} characters long.`;
    return false;
  } else if (!hasUppercase) {
    errors.password = 'Password must contain at least one uppercase letter.';
    return false;
  } else if (!hasLowercase) {
    errors.password = 'Password must contain at least one lowercase letter.';
    return false;
  } else if (!hasNumber) {
    errors.password = 'Password must contain at least one number.';
    return false;
  } else if (!hasSpecialChar) {
    errors.password = 'Password must contain at least one special character.';
    return false;
  } else {
    errors.password = null;
    return true;
  }
}

export const validateConfirmPassword = (confirmPassword, password, blur, errors) => {
  if (!blur) {
    errors.confirmPassword = null;
    return true;
  }
  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
    return false;
  } else {
    errors.confirmPassword = null;
    return true;
  }
}

const validateNameField = (nameValue, fieldName, fieldDesc, allowNull, blur, errors) => {
  if (!blur) {
    errors[fieldName] = null;
    return true;
  }

  if (!allowNull && !validateRequiredField(nameValue, fieldName, fieldDesc, errors, blur)) {
    return false;
  }

  if (nameValue.length > MAX_NAME_LENGTH) {
    errors[fieldName] = `${fieldDesc} cannot be more than ${MAX_NAME_LENGTH} characters.`;
    return false;
  }

  return true;
}

export const validateFirstName = (firstName, blur, errors) => {
  return validateNameField(firstName, 'firstName', 'First Name', false, blur, errors);
}

export const validateLastName = (lastName, blur, errors) => {
  return validateNameField(lastName, 'lastName', 'Last Name', false, blur, errors);
}

export const validateNickname = (nickname, blur, errors) => {
  return validateNameField(nickname, 'nickname', 'Nickname', true, blur, errors);
}

export const validatePosition = (position, errors) => {
  if (!validateRequiredField(position, 'position', 'Preferred Position', errors, true)) {
    return false;
  }

  return true;
}
