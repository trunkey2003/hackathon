const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const booking = new Schema({
    renter_id: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    room_id: {type: Schema.Types.ObjectId, ref: 'Room', required: true},
    time : { type : Date, required: true, default: Date.now },
    note: {type : String}
});

module.exports = mongoose.model('booking', booking);