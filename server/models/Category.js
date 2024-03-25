const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({

    name : {
        type: String,
        required: 'This field is required',
        trim: true,
        unique: true
    },
    image : {
        type: String,
        required: 'This field is required',
    },

});

module.exports = mongoose.model('Category', categorySchema);