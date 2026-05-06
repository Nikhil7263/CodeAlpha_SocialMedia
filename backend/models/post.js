const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },

    likes: {
        type: Number,
        default: 0
    },

    comments: [
        {
            text: String
        }
    ]

}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;