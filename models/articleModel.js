const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    author: {
        type: String,
        required: true,
    },
    images: [{
        type: String
    }],
});

module.exports = mongoose.model('Article', articleSchema);
