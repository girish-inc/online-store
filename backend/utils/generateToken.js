const jwt = require('jsonwebtoken');

// Generate access token - expires in 5 minutes
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.jwtSecret, {
    expiresIn: process.env.jwtAccessTokenExpire,
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.jwtSecret, {
    expiresIn: process.env.jwtRefreshTokenExpire,
  });
};

module.exports = { generateToken, generateRefreshToken };