const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CarSchema = new Schema({
    id: Number,
    route_id: String,
    date: Number,
    _inbound: Boolean,
    _slope: Boolean
});

module.exports = mongoose.model('Car', CarSchema);