const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TimeSchema = new Schema({
    id: Number,
    car_id: Number,
    stop_id: Number,
    time: String,
    prev: {
        stop_id: Number,
        time: String
    }
});

module.exports = mongoose.model('Time', TimeSchema);