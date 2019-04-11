const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PostsSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    title: {
        type: String
    },

    category: {
        type: String
    },

    author: {
        type: String
    },

    body: {
        type: String
    },
    comments: [{
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            },
            text: {
                type: String,
                required: true
            },
            name: {
                type: String,
            },
            date: {
                type: Date,
                default: Date.now
            }
        }

    ],
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Posts = mongoose.model('posts', PostsSchema);