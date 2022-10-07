const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    post_id : mongoose.Types.ObjectId,
    user_id : mongoose.Types.ObjectId,
    commentDescription: String,
    likeCount: Number,
    dislikeCount: Number
})

module.exports = mongoose.model('CommentSchema', commentSchema)