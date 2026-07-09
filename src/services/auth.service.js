const jwt = require("jsonwebtoken");

/**
 * Verifies a JWT token using the secret from environment variables
 * @param {string} token 
 * @returns {object} Decoded payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  verifyToken,
};
