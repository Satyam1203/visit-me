let mongoose = require("mongoose");

let scheduleSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  storeId: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },
});

let Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
