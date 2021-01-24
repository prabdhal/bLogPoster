const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  blogRef: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  usersLiked: {
    type: Array,
  },
  replies: {
    type: Array,
    defauly: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
