const errorMessages = {
  INVALID_URL: 'Enter a valid URL that starts with http:// or https://.',
  INVALID_SHORT_CODE: 'Aliases can use 3-32 letters, numbers, underscores, or hyphens.',
  SHORT_CODE_RESERVED: 'That alias is reserved. Choose a different one.',
  SHORT_CODE_ALREADY_EXISTS: 'That alias is already in use.',
  INVALID_EXPIRATION_DATE: 'Choose a future expiration date.',
  INVALID_CREDENTIALS: 'The email or password is incorrect.',
  AUTHENTICATION_REQUIRED: 'Please sign in to continue.',
  INVALID_ACCESS_TOKEN: 'Your session expired. Please sign in again.',
  INVALID_REFRESH_TOKEN: 'Your saved session expired. Please sign in again.',
  REFRESH_TOKEN_REQUIRED: 'Please sign in to continue.',
  USER_NOT_FOUND: 'We could not find this account.',
  PASSWORD_MANAGED_BY_GOOGLE: 'Password changes are managed through Google for this account.',
  CURRENT_PASSWORD_INVALID: 'The current password is incorrect.',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please wait a bit and try again.',
  LINK_PASSWORD_REQUIRED: 'This link is password protected.',
  LINK_PASSWORD_INVALID: 'The password is incorrect. Please try again.',
  LINK_EXPIRED: 'This short link has expired.',
  LINK_DISABLED: 'This short link is currently disabled.',
  LINK_NOT_FOUND: 'We could not find that short link.'
};

export const mapApiError = (error) => {
  const response = error?.response;
  const code = response?.data?.error?.code;
  const status = response?.status;
  const retryAfter = response?.headers?.['retry-after'];
  const fallbackMessage = response?.data?.error?.message || error?.message || 'Something went wrong. Please try again.';

  const message = errorMessages[code]
    || (status === 429 ? errorMessages.RATE_LIMIT_EXCEEDED : null)
    || fallbackMessage;

  const mappedError = new Error(retryAfter ? `${message} Try again in ${retryAfter} seconds.` : message);
  mappedError.code = code;
  mappedError.status = status;
  mappedError.details = response?.data?.error?.details;
  mappedError.retryAfter = retryAfter;

  return mappedError;
};

export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => error?.message || fallback;
