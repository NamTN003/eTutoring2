const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Comment = require('../../Models/Comment');
const User = require('../../Models/User');

router.post('/', async (req, res) => {
    try {
        const comment = new Comment(req.body);
        await comment.save();
        res.status(201).send(comment);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/:blogId', async (req, res) => {
    try {
        const { blogId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).json({ message: "Blog ID không hợp lệ!" });
        }

        const comments = await Comment.find({ blog_id: blogId });


        if (!comments || comments.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy bình luận!" });
        }

        const userIds = [...new Set(comments.map(comment => comment.user_id.toString()))];

        const users = await User.find({ _id: { $in: userIds } }).select('_id name');

        const userMap = users.reduce((acc, user) => {
            acc[user._id] = user.name;
            return acc;
        }, {});

        const commentsWithUser = comments.map(comment => ({
            ...comment._doc,
            user_name: userMap[comment.user_id] || "Unknown User"
        }));

        res.status(200).json(commentsWithUser);
    } catch (error) {
        console.error(" Lỗi khi lấy comments:", error);
        res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
});



module.exports = router;