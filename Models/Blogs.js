const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    visibility: { type: String, enum: ["all", "student", "tutor"], required: true },
    content: { type: String },
    uploaded_file: { type: String }
  }, { timestamps: true });

const Blog = mongoose.model('blog', BlogSchema,'blog');
module.exports = Blog;
