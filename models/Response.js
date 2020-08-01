const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ResponseSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    feedId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createDate: {
        type: Date,
        default: Date.now,
    }
})

module.exports = Response = mongoose.model('responses', ResponseSchema);