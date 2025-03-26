const express = require("express");
const Message = require("../../Models/Message");
const User = require("../../Models/User"); // Thêm User model
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// 📌 Gửi tin nhắn
router.post("/send", authMiddleware, async (req, res) => {
    try {
        const { content, image_url, receiver_id } = req.body; // Nhận receiver_id từ FE
        const sender_id = req.user.userId;

        console.log("📩 Receiver ID từ frontend:", receiver_id); // Log ra để kiểm tra
        console.log("📨 Sender ID từ token:", sender_id);

        const sender = await User.findById(sender_id);
        const receiver = await User.findById(receiver_id);
        if (!sender || !receiver) {
            return res.status(404).json({ message: "Người gửi hoặc người nhận không tồn tại" });
        }

        const message = new Message({ sender_id, receiver_id, content, image_url, status: "sent" });
        await message.save();

        res.status(201).json({ message: "Tin nhắn đã gửi", data: message });
    } catch (error) {
        console.error("❌ Lỗi khi gửi tin nhắn:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});

// 📌 Lấy danh sách tin nhắn giữa student và tutor
router.get("/conversation/:userId", authMiddleware, async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.userId;
        const { tutor_id } = req.query;

        const messages = await Message.find({
            $or: [
                { sender_id: currentUserId, receiver_id: tutor_id  },
                { sender_id: tutor_id , receiver_id: currentUserId },
                { sender_id: currentUserId, receiver_id: userId  },
                { sender_id: userId , receiver_id: currentUserId }

            ]
        }).sort({ createdAt: 1 }).populate("sender_id receiver_id", "name email"); // Thêm thông tin user

        res.json(messages);
    } catch (error) {
        console.error("❌ Lỗi khi lấy tin nhắn:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});

// 📌 Lấy danh sách hội thoại gần đây
router.get("/recent", authMiddleware, async (req, res) => {
    try {
        const currentUserId = req.user.userId;

        const recentMessages = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender_id: currentUserId }, { receiver_id: currentUserId }]
                }
            },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$sender_id", currentUserId] },
                            "$receiver_id",
                            "$sender_id"
                        ]
                    },
                    lastMessage: { $first: "$content" },
                    createdAt: { $first: "$createdAt" }
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        res.json(recentMessages);
    } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách hội thoại:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});

// 📌 Đánh dấu tin nhắn là đã đọc
router.put("/mark-as-read/:messageId", authMiddleware, async (req, res) => {
    try {
        const { messageId } = req.params;

        const updatedMessage = await Message.findByIdAndUpdate(
            messageId,
            { status: "read" },
            { new: true }
        );

        if (!updatedMessage) return res.status(404).json({ message: "Không tìm thấy tin nhắn" });

        res.json({ message: "Tin nhắn đã đọc", data: updatedMessage });
    } catch (error) {
        console.error("❌ Lỗi khi cập nhật trạng thái tin nhắn:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});

// 📌 Xóa tin nhắn
router.delete("/:messageId", authMiddleware, async (req, res) => {
    try {
        const { messageId } = req.params;

        const deletedMessage = await Message.findByIdAndDelete(messageId);
        if (!deletedMessage) return res.status(404).json({ message: "Không tìm thấy tin nhắn" });

        res.json({ message: "Tin nhắn đã xóa", data: deletedMessage });
    } catch (error) {
        console.error("❌ Lỗi khi xóa tin nhắn:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});

module.exports = router;
