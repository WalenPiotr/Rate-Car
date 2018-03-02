var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var schema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String },
    isAdmin: { type: Boolean, default: false },
    email: { type: String, unique: true, required: true },
    isActivated: { type: Boolean, default: false },
    activationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
},
    { emitIndexErrors: false }
);

schema.index({username: "text"})

schema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", schema);