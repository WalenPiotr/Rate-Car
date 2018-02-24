var mongoose = require("mongoose");

var schema = new mongoose.Schema(
    {
    model: String,
    brand: String,
    description: String,
    // comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Model' }]
    },
    {
        emitIndexErrors: false
    }
);

schema.index({model: "text", brand: "text"})

module.exports = mongoose.model("Car", schema);
