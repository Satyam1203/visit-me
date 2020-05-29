let mongoose = require('mongoose');

let apptScheduleSchema = new mongoose.Schema({
    Date: String,
    stTime: String,
    enTime: String,
    count: Number
});

let Schedule = mongoose.model('Schedule', apptScheduleSchema);

module.exports = Schedule;