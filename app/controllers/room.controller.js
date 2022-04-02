const room = require('../models/room.model');
// const { v4: uuidv4 } = require('uuid');

class RoomController {
    addRoom(req, res) {
        const roomObject = req.body;
        const newRoom = new room(roomObject);
        newRoom.save()
            .then(() => res.status(200).send({ message: "new room added" }))
            .catch(() => res.status(403).send({ message: "database error" }));
    }

    getRoom(req, res) {
        const filter = {};
        filter.room_id = (req.query?.roomId) ? req.query.roomId : null;
        filter.title = (req.query?.title) ? { $regex: '.*' + req.query.title + '.*' } : null;
        room.find(filter).then((room) => {
            res.send(room);
        })
            .catch(() =>
                res.status(500).send({ message: "Cannot get all rooms" })
            )
    }

    modifyRoom(req, res) {
        const roomObject = req.body;
        const roomId = req.params.roomId;
        room.findOneAndUpdate({ _id: roomId }, roomObject, { new: true })
            .then((room) => {
                res.send(room);
            })
            .catch(() => res.status(403).send({ message: "Cannot modify room" }));
    }

    deleteRoom(req, res){
        const roomId = req.params.roomId;
        room.findOneAndDelete({_id: roomId}).then(() =>
            res.send({message: `delete ${roomId}`})
        )
        .catch(() => res.status(403).send({ message: "Cannot delete room" }));
    }

}

module.exports = new RoomController;