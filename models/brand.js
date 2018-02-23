var mongoose = require("mongoose");

var schema = new mongoose.Schema({
    name: String,
    models: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Model' }]
});

module.exports = mongoose.model("Brand", schema);