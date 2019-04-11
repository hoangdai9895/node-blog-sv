const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CategoriesSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    title: {
        type: String
    }

})

module.exports = Categories = mongoose.model('Categories', CategoriesSchema);