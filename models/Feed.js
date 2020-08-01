const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FeedSchema = new Schema({
    userId: {
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

module.exports = Feed = mongoose.model('feeds', FeedSchema);