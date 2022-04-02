const user = require('../models/user.model');
// const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const saltRounds = 13;
var jwt = require('jsonwebtoken');

class UserController {
    //get 1 user from user or admin
    // async getUser(req, res, next) {
    //     const songCount = await userSong.count({ userid: res.locals.id });
    //     user.findOneAndUpdate({ userid: res.locals.id }, { songCount: songCount }, { returnOriginal: false }).then((data) => { data.Phone = undefined; data.Email = undefined; data.password = undefined; res.send(data) });
    // }

    // getUserNoAuth(req, res, next) {
    //     user.find({ userid: res.locals.id })
    //         .then((user) => { user[0].dateOfBirth = undefined; user[0].Phone = undefined; user[0].Email = undefined; user[0].password = undefined; res.json(user[0]) })
    // }

    async modifyUserFullName(req, res, next) {
        let result = await user.findOneAndUpdate({ username: res.locals.username }, { fullName: req.body.fullName }, { returnOriginal: false });
        res.send(result);
    }

    async addUser(req, res) {
        try {
            const userObject = req.body;
            const hashedPassword = await bcrypt.hash(userObject.password, saltRounds);
            userObject.password = hashedPassword
            const newUser = new user(userObject);
            newUser.save()
                .then(() => res.status(200).send({ status: true, message: "sign up successful" }))
                .catch(() => res.status(403).send({ status: false, message: "user already exists or server error" }));
        }
        catch (e) {
            res.status(503).send({ message: "error add user" });
        }
    }

    checkUserName(req, res) {
        user.findOne({ username: req.body.username })
            .then((user) => { if (user) res.send("false"); else res.send("true") })
            .catch(() => { res.send("server error") })
    }

    validateUser(req, res, next) {
        user.find({ username: res.locals.username })
            .then((user) => { res.locals.id = user[0].userid; next() })
            .catch(() => { res.status(404).send(`user ${res.locals.username} doesn't exist`) });
    }

    validateLogin(req, res, next) {
        user.findOne({ user_name: req.body.user_name })
            .then(async (user) => {
                const valid = await bcrypt.compare(req.body.password, user.password);
                if (valid) { res.locals.user_id = user._id; res.locals.role = user.role; next(); } else { res.status(403).send({ status: false, message: `Wrong Username or password` }) }
            })
            .catch(() => { res.status(409).send({ status: false, message: `Wrong Username or password` }) });
    }

    setToken(req, res, next) {
        const user = { id: res.locals.user_id, role: res.locals.role };
        jwt.sign(user, process.env.TOKEN_SECRET_KEY, (err, token) => {
            if (err) {
                res.status(403).send("Cannot Set Token");
                return;
            }
            res.locals.token = token;
            next();
        });
    }

    validateTokenCookie(req, res, next) {
        jwt.verify(req.cookies.token, process.env.TOKEN_SECRET_KEY, (err, user) => {
            if (err) res.status(403).send("Invalid Token");
            res.locals.user_id = user.id;
            res.locals.role = user.role;
            next();
        })
    }

    validateAddRoom(req, res, next) {
        if (res.locals.role == 1) {
            res.status(403).send({ message: "Vui lòng đăng nhập dưới vai trò chủ trọ" });
            return;
        }
        next();
    }

    setTokenCookie(req, res, next) {
        res.cookie('token', res.locals.token, {
            sameSite: 'none',
            secure: (process.env.DEV_ENV) ? false : true,
            httpOnly: true,
            maxAge: 3600000 * 24 * 7,
        }).status(200).send({ username: res.locals.username })
    }

    getUserSongs(req, res, next) {
        userSong.find({ userid: res.locals.id })
            .then((songs) => { res.json(songs); })
            .catch(() => { res.json("error user songs") });
    }

    async postUserSongs(req, res, next) {
        const songCount = await userSong.count({ userid: req.body.userid });
        res.send(req.body);
        const song = new userSong(req.body);
        song.save()
            .then(() => { user.findOneAndUpdate({ userid: req.body.userid }, { songCount: songCount }, { returnOriginal: false }).then(() => res.status(200).send("Song Added !!")) })
            .catch(() => res.status(403).send("CANNOT POST SONG"));
    }

    async deleteUserSongs(req, res, next) {
        const songCount = await userSong.count({ userid: res.locals.id });
        userSong.deleteOne({ _id: req.params.id, userid: res.locals.id })
            .then(() => { user.findOneAndUpdate({ userid: res.locals.id }, { songCount: songCount }, { returnOriginal: false }).then(() => res.status(200).send("Song Deleted !!")) })
            .catch(() => res.send(`cannot delete song id : ${req.params.id}`));
    }

    async deleteUserSongsBySongID(req, res, next) {
        const songCount = await userSong.count({ userid: res.locals.id });
        userSong.deleteOne({ songid: req.params.id, userid: res.locals.id })
            .then(() => { user.findOneAndUpdate({ userid: res.locals.id }, { songCount: songCount }, { returnOriginal: false }).then(() => res.status(200).send("Song Deleted !!")) })
            .catch(() => res.send(`cannot delete song id : ${req.params.id}`));
    }

    // getCookie(req, res, next){
    //     res.cookie("username", "trunkey", {sameSite: 'strict', path: '/', expires: new Date(new Date().getTime() + 60*1000), httpOnly: true}).status(200).send("cookie installed");
    // }

    // postCookie(req, res, next){
    //     res.cookie("username", req.body.username, {sameSite: 'strict', path: '/', expires: new Date(new Date().getTime() + 5*1000), httpOnly: true}).status(200).send("cookie installed");
    // }

    clearCookie(req, res, next) {
        res.cookie('token', "none", {
            sameSite: 'none',
            secure: true,
            httpOnly: true,
            maxAge: 0,
        }).status(200).send("Cookie cleared");
    }

}

module.exports = new UserController;