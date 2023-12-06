//userModels.js
const mongoose = require('mongoose');

const userDB = new mongoose.Schema({
firstName: {
    type: String,
    required: true,
},
lastName: {
    type: String,
    required: true,
},
email: {
    type: String,
    required: true,
    unique: true,
},
password: {
    type: String,
    required: true,
},
role: {
    type: String,
    default: 'user',
},
profileImage: {
    type: String, // Assuming you store the image URI as a string
},
questions: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
    },
  ],
}, {timestamps: true});

module.exports = mongoose.model('User', userDB);
