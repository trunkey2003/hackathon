const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    user_name:{type:String, unique: true, required: true},
    password:{type:String, required: true},
    role: {type: Number, required: true}, // 0 : chủ trọ, 1 : người trọ
    full_name : {type:String, default:"full name"},
    date_of_birth: {type:String, default:"01/01/2022"},
    phone:{type:String, default:"0123456789"},
    emaill:{type:String, default: "user@user.com"},
    avatar:{type: String, default:"https://trunkey2003.github.io/general-img/default-profile-pic.jpg"},
});

module.exports = mongoose.model('user', user);