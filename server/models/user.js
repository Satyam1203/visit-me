let mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  refreshTokens: {
    type: [String],
    select: false,
  },
});

let User = mongoose.model("Detail", userSchema);

module.exports = User;
