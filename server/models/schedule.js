let mongoose = require("mongoose");

let scheduleSchema = new mongoose.Schema({
  time: String,
  date: Date,
  userId: String,
  storeId: String,
  purpose: String,
});

let Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
