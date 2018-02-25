var mongoose = require("mongoose");
var User = require("./user.js");

var schema = new mongoose.Schema(
    {
    title: String,
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    },
    {timestamps: true}
);

module.exports = mongoose.model("Comment", schema);
