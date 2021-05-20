const jwt = require('jsonwebtoken');
const logger = require('./logging');

const getClientToken = (user) => {
  const JWTPayload = {
    id: user._id,
    isVerified: user.isVerified,
  };
  try {
    const token = jwt.sign(
      JWTPayload,
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.CLIENT_SESSION_EXPIRES_IN,
      },
    );
    return token;
  } catch (error) {
    logger.error(error);
    return false;
  }
};
module.exports = { getClientToken };
