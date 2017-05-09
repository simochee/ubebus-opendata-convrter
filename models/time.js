const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TimeSchema = new Schema({
    id: Number,
    car_id: Number,
    stop: Number,
    time: String,
    next: {
        stop: Number,
        time: String
    }
});

module.exports = mongoose.model('Time', TimeSchema);