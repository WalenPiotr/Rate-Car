var mongoose = require('mongoose');
var Comment = require('./comment.js');

var schema = new mongoose.Schema(
    {
        model: String,
        brand: String,
        description: String,
        author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            username: String,
        },
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    },

    {
        emitIndexErrors: true,
    },
);

schema.index({ model: 'text', brand: 'text' });

module.exports = mongoose.model('Car', schema);
