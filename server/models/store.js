let mongoose = require("mongoose");

let storeSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  password: String,
  opens_at: String,
  closes_at: String,
  working_days: [String],
  refreshTokens: {
    type: [String],
    select: false,
  },
});

let Store = mongoose.model("Detail", storeSchema);

module.exports = Store;
