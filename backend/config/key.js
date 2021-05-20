// config variable goes here
const adminUserBody = {
  email: process.env.SEED_ADMIN_EMAIL,
  username: process.env.SEED_ADMIN_USERNAME,
  password: process.env.SEED_ADMIN_PASSWORD,
  name: process.env.SEED_ADMIN_NAME,
};
const ACCOUNT_TYPE_DEFAULT = 'email-password';
const ACCOUNT_TYPE_GOOGLE = 'google';
const ACCOUNT_TYPE_FACEBOOK = 'facebook';

module.exports = {
  adminUserBody,
  ACCOUNT_TYPE_GOOGLE,
  ACCOUNT_TYPE_DEFAULT,
  ACCOUNT_TYPE_FACEBOOK,
};
