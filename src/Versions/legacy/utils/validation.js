export const getvalidationMessages = (fieldName = 'This field') => ({
  required: `${fieldName} is required`,
  empty: `${fieldName} cannot be empty`,
  tooShort: `${fieldName} must be at least 2 characters long`,
  tooLong: `${fieldName} cannot  exceed 50 characters`,
  invalidChars: `${fieldName} can only contain letters, hyphens, and astrophes`,
  multipleSpaces: `${fieldName} cannot contain multiple spaces`,
  invalidFormat: `${fieldName} cannot start/end with hyphen/astrophe or have consecutive special characters`,
  invalidEmail: `Looks like this is not an ${fieldName}`,
  invalidPassword: `${fieldName} should contain at least one number and one special character`,
});

// function for first name and last name validation
export const validateName = (value, fieldName = 'Name') => {
  const messages = getvalidationMessages(fieldName);

  if (!value || typeof value !== 'string') {
    return messages.required;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) return messages.empty;
  if (trimmedValue.length < 2) return messages.tooShort;
  if (trimmedValue.length > 50) return messages.tooLong;

  const validNameRegex = /^[a-zA-Zа-яА-ЯёЁ\-'\s]+$/;
  if (!validNameRegex.test(trimmedValue)) return messages.invalidChars;
  if (/\s{2,}/.test(trimmedValue)) return messages.multipleSpaces;
  if (/^[-']|[-']$|[-']{2,}/.test(trimmedValue)) return messages.invalidFormat;

  return '';
};

// function for email validation
export const validateEmail = (value, fieldName = 'Email') => {
  const messages = getvalidationMessages(fieldName);

  if (!value || typeof value !== 'string') {
    return messages.required;
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) return messages.empty;
  if (trimmedValue.length < 2) return messages.tooShort;

  const validEmailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  if (!validEmailRegex.test(trimmedValue)) return messages.invalidEmail;

  return '';
};

// function for password validation
export const validatePassword = (value, fieldName = 'Password') => {
  const messages = getvalidationMessages(fieldName);

  if (!value || typeof value !== 'string') {
    return messages.required;
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) return messages.empty;
  if (trimmedValue.length < 2) return messages.tooShort;
  if (trimmedValue.length > 50) return messages.tooLong;

  const validPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{2,50}$/;
  if (!validPasswordRegex.test(trimmedValue)) return messages.invalidPassword;
};