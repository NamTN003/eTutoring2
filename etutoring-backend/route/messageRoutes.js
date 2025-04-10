const express = require("express");
const Message = require("../Models/Message");
const User = require("../Models/User");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/send", authMiddleware, async (req, res) => {
    try {
        const { content, receiver_id } = req.body;
        const sender_id = req.user.userId;

        if (!sender_id || !receiver_id) {
            return res.status(400).json({ message: "Thiếu sender_id hoặc receiver_id" });
        }

        const message = new Message({ sender_id, receiver_id, content, status: "sent" });
        await message.save();

        const userSockets = req.app.get("userSockets"); 
        const io = req.app.get("io"); 

        const receiverSocketId = userSockets.get(receiver_id.toString());

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("receiveMessage", message);
        }

        res.status(201).json({ message: "Tin nhắn đã gửi", data: message });
    } catch (error) {
        console.error(" Lỗi khi gửi tin nhắn:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});



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
        }).sort({ createdAt: 1 }).populate("sender_id receiver_id", "name email");

        res.json(messages);
    } catch (error) {
        console.error(" Lỗi khi lấy tin nhắn:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});


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
        console.error(" Lỗi khi lấy danh sách hội thoại:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});


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
        console.error(" Lỗi khi cập nhật trạng thái tin nhắn:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});


router.delete("/:messageId", authMiddleware, async (req, res) => {
    try {
        const { messageId } = req.params;

        const deletedMessage = await Message.findByIdAndDelete(messageId);
        if (!deletedMessage) return res.status(404).json({ message: "Không tìm thấy tin nhắn" });

        res.json({ message: "Tin nhắn đã xóa", data: deletedMessage });
    } catch (error) {
        console.error(" Lỗi khi xóa tin nhắn:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});

module.exports = router;