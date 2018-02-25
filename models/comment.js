var mongoose = require("mongoose");
var User = require("./user.js");

var schema = new mongoose.Schema(
    {
    title: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    text: String
    }
);

module.exports = mongoose.model("Comment", schema);
