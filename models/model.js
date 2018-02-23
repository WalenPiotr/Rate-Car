var mongoose = require("mongoose");

var schema = new mongoose.Schema({
    brand : {type: mongoose.Schema.Types.ObjectId, ref: "Brand" },    
    name: String,
    description: String,
});

module.exports = mongoose.model("Model", schema);
