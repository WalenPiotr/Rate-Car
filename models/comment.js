var mongoose = require("mongoose");

var schema = new mongoose.Schema(
    {
    author: String,
    text: String
    }
);

module.exports = mongoose.model("Comment", schema);
