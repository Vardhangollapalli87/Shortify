const USER_ROLES = Object.freeze({
  USER: "user",
  ADMIN: "admin"
});

const AUTH_PROVIDERS = Object.freeze({
  CREDENTIALS: "credentials",
  GOOGLE: "google",
  MIXED: "mixed"
});

module.exports = {
  USER_ROLES,
  AUTH_PROVIDERS
};
