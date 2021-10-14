let mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  password: String,
  refreshTokens: {
    type: [String],
    select: false,
  },
});

let User = mongoose.model("Detail", userSchema);

module.exports = User;
