var mongoose = require("mongoose");

var schema = new mongoose.Schema({
    name: String,
    description: String,

    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Model' }]
});

module.exports = mongoose.model("Model", schema);
