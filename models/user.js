var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String },
    isAdmin: { type: Boolean, default: false },
    email: { type: String, unique: true, required: true },
    isActivated: { type: Boolean, default: false },
    activationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);