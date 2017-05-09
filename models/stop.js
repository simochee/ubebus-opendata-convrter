const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StopSchema = new Schema({
    id: Number,
    name: String,
    name_kana: String
});

module.exports = mongoose.model('Stop', StopSchema);