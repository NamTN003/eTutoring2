const mongoose = require('mongoose');

// Comment Model
const commentSchema = new mongoose.Schema({
    blog_id: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true }
  }, { timestamps: true });
  
  const Comment = mongoose.model("comment", commentSchema, "comment");
  module.exports = Comment;
