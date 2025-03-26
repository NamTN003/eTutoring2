const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Comment = require('../../Models/Comment');
const User = require('../../Models/User');
// Tạo bình luận mới
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

        // Lấy tất cả comments theo blogId
        const comments = await Comment.find({ blog_id: blogId });

        console.log("📥 Comments fetched:", comments);

        if (!comments || comments.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy bình luận!" });
        }

        // Tạo danh sách userId cần lấy thông tin, loại bỏ trùng lặp
        const userIds = [...new Set(comments.map(comment => comment.user_id.toString()))];

        // Lấy thông tin user từ danh sách userIds
        const users = await User.find({ _id: { $in: userIds } }).select('_id name');

        // Tạo object map userId -> userName
        const userMap = users.reduce((acc, user) => {
            acc[user._id] = user.name;
            return acc;
        }, {});

        // Gắn thêm thông tin user vào comment
        const commentsWithUser = comments.map(comment => ({
            ...comment._doc, // Chuyển comment sang object để chỉnh sửa
            user_name: userMap[comment.user_id] || "Unknown User"
        }));

        console.log("📤 Comments with user:", commentsWithUser);

        res.status(200).json(commentsWithUser);
    } catch (error) {
        console.error("❌ Lỗi khi lấy comments:", error);
        res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
});



module.exports = router;