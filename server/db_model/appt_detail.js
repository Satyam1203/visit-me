let mongoose = require('mongoose');

let apptDetailSchema = new mongoose.Schema({
    name: String,
    purpose: String,
    aDate: String,
    aTime: String,
    bookingDate: {type: Date, default: Date.now()}
});

let Detail = mongoose.model('Detail', apptDetailSchema);

module.exports = Detail;