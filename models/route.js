const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RouteSchema = new Schema({
    id: {
        type: String,
        unique: true
    },
    via: [ String ],
    stops: [ Number ]
});

module.exports = mongoose.model('Route', RouteSchema);