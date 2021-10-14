const jwt = require("jsonwebtoken");

const generateAccessToken = (payload) => {
  return jwt.sign({ user: payload }, process.env.SECRET_KEY, {
    expiresIn: "15min",
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign({ user: payload }, process.env.SECRET_RT_KEY, {
    expiresIn: "5d",
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
