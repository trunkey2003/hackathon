const booking = require('../models/booking.model');
// const { v4: uuidv4 } = require('uuid');

class BookingController {
    addBooking(req, res) {
        const bookingObject = req.body;
        const newBooking = new booking(bookingObject);
        newBooking.save()
            .then(() => res.status(200).send({ message: "new booking added" }))
            .catch(() => res.status(403).send({ message: "cannot save your booking" }));
    }

    getBooking(req, res){
        const filter = {};
        filter.room_id = (req.query?.roomId)? req.query.roomId : null;
        booking.find(filter).then((booking) => {
            res.send(booking);
        })
        .catch(() => {
            res.send(() => res.status(500).send({message : "cannot get all rooms"}))
        })
    }

}

module.exports = new BookingController;