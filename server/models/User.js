const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({

    email : {
        type: String,
        required: 'This field is required',
        trim: true,
        unique: true
    },
    password : {
        type: String,
        required: 'This field is required',
    },

});

module.exports = mongoose.model('User', userSchema);