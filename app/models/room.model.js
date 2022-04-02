const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const room = new Schema({
    landlord_id: {type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true},
    title: {type: String, required: true},
    picture: {type: Array, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    address: {type: String, required: true},
    area: {type: Number, required: true},
    keyword: {type: Array}
});

module.exports = mongoose.model('room', room);