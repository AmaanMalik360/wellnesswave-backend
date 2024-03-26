const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
{
    heading: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["Survey", "Exercise"],
        required: true
    },
    subType:{
        type: String
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
{ timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;