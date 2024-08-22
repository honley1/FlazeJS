const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        required: true,
    },
    bio: {
        type: String,
        maxlength: 500,
    },
    activationLink: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'BANNED'],
        default: 'INACTIVE',
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER',
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);


