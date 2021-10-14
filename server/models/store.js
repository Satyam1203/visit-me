let mongoose = require("mongoose");

let storeSchema = new mongoose.Schema({
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
  opens_at: {
    type: String,
    required: true,
  },
  closes_at: {
    type: String,
    required: true,
  },
  working_days: {
    type: [Number],
    required: true,
  },
  refreshTokens: {
    type: [String],
    select: false,
  },
});

let Store = mongoose.model("Store", storeSchema);

module.exports = Store;
