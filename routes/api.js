const express = require('express');
const router = express.Router();

const apiController = require('../app/controllers/api.controller');

const userController = require('../app/controllers/user.controller');
const roomController = require('../app/controllers/room.controller');
const bookingController = require('../app/controllers/booking.controller');
// const Zingmp3Controller = require('../app/controllers/zingmp3.controller');

//user
router.post('/user/signup/checkusername', userController.checkUserName);
router.post('/user/signup', userController.addUser);
router.get('/user/signout', userController.clearCookie);
router.post('/user/signin', userController.validateLogin, userController.setToken, userController.setTokenCookie);

//room
router.get('/room', roomController.getRoom);
router.post('/room', userController.validateTokenCookie, userController.validateAddRoom ,roomController.addRoom);
router.put('/room', roomController.modifyRoom);

//booking
router.get('/booking', bookingController.getBooking);
router.post('/booking', bookingController.addBooking);

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
router.get('/',apiController.show);


module.exports = router;