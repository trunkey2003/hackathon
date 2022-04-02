// const usSong = require('./models/usSongs.model');
// const vnSong = require('./models/vnSongs.model');

class ApiController{
    show(req,res,next){
        res.json("Hello, this is hackathon api");
    }

    getUsSong(req,res,next){
        // usSong.find({}) 
        // .then((songs) => res.json(songs))
    }

    getVnSong(req,res,next){
        // vnSong.find({}) 
        // .then((songs) => res.json(songs))
    }
}

module.exports = new ApiController;