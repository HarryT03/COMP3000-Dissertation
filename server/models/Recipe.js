const mongoose = require('mongoose');
const recipeSchema = new mongoose.Schema({

    name : {
        type: String,
        required: 'This field is required',
        trim: true,
        unique: true
    },
    description : {
        type: String,
        required: 'This field is required',
    },
    creator : {
        type: String,
        required: 'This field is required',
    },
    ingredients : {
        type: Array,
        required: 'This field is required',
    },
    category : {
        type: String,
        enum: ['Thai', 'American', 'Chinese', 'Mexican', 'Indian', 'Spanish'],
        required: 'This field is required',
    },
    image : {
        type: String,
        required: 'This field is required',
    },
    

});

recipeSchema.index({ name: 'text', description: 'text'});


module.exports = mongoose.model('Recipe', recipeSchema);