const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
  fileFilter: function (_req, file, cb) {
    checkFileType(file, cb);
  }
});

function checkFileType(file, cb) {
  const arr = file.originalname.split('.');
  const extension = arr[arr.length - 1];
  const filetypes = ['jpeg', 'jpg', 'png', 'gif', 'webp'];
  const validatedExtension = (extension, filetypes) =>{
    for (let i = 0; i < filetypes.length; i++) {
      if (filetypes[i] == extension) {
        return true;
      }
    }
    return cb(`Extension ${extension} is not allowed`);
  };
  const result = validatedExtension(extension, filetypes);
  return cb(null, true);
}


const apiController = require('../app/controllers/api.controller');

const userController = require('../app/controllers/user.controller');
const roomController = require('../app/controllers/room.controller');
const bookingController = require('../app/controllers/booking.controller');
const s3Controller = require('../app/controllers/s3.controller');
const { validate } = require('../app/models/user.model');
// const Zingmp3Controller = require('../app/controllers/zingmp3.controller');

//user
router.post('/user/signup', userController.addUser);
router.get('/user/signout', userController.clearCookie);
router.post('/user/signin', userController.validateLogin, userController.setToken, userController.setTokenCookie);
router.get('/user', userController.validateTokenCookie, userController.getUser);

//room
router.get('/room', roomController.getRoom);
router.post('/room', userController.validateTokenCookie, userController.validateAddRoom, upload.array('images', 3), roomController.addRoom);
router.put('/room',  roomController.modifyRoom);

//booking
router.get('/booking', bookingController.getBooking);
router.post('/booking', bookingController.addBooking);

//upload file
// router.post('/uploadfile', upload.array('images', 3), s3Controller.uploadImage);

/* GET users listing. */
// router.get('/user/:username/songs', userController.validateTokenCookie ,userController.validateUser ,userController.getUserSongs);
// router.post('/user/:username/songs', userController.validateTokenCookie, userController.validateUser, userController.postUserSongs);
// router.delete('/user/:username/songs/:id', userController.validateTokenCookie, userController.validateUser, userController.deleteUserSongs);
// router.delete('/user/:username/songid/:id/', userController.validateTokenCookie, userController.validateUser, userController.deleteUserSongsBySongID);
// router.get('/user/:username', userController.validateTokenCookie, userController.validateUser, userController.getUser);
// router.put('/user/edit/fullname', userController.validateTokenCookie, userController.validateUser, userController.modifyUserFullName);
// router.get('/admin/vn', apiController.getVnSong);
// router.get('/admin/us', apiController.getUsSong);
// router.post('/zingmp3/songs', Zingmp3Controller.searchSongs);
// router.get('/cookie', userController.getCookie);
// router.post('/cookie', userController.postCookie);
router.get('/', apiController.show);


module.exports = router;