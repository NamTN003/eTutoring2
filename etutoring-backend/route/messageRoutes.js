const express = require("express");
const Message = require("../../Models/Message");
const User = require("../../Models/User"); // Thêm User model
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// 📌 Gửi tin nhắn
router.post("/send", authMiddleware, async (req, res) => {
    try {
        const { content, receiver_id } = req.body;
        const sender_id = req.user.userId;

        console.log("📩 Gửi tin nhắn:");
        console.log("📤 Sender ID:", sender_id);
        console.log("📥 Receiver ID:", receiver_id);
        console.log("📜 Nội dung:", content);

        if (!sender_id || !receiver_id) {
            return res.status(400).json({ message: "Thiếu sender_id hoặc receiver_id" });
        }

        // Lưu tin nhắn vào database
        const message = new Message({ sender_id, receiver_id, content, status: "sent" });
        await message.save();

        // 🔥 Lấy userSockets từ server (đừng tạo lại)
        const userSockets = req.app.get("userSockets"); 
        const io = req.app.get("io"); 

        // 🔎 Kiểm tra socket của người nhận
        const receiverSocketId = userSockets.get(receiver_id.toString());
        console.log(`🔎 Tìm socket của người nhận: ${receiver_id} -> socket ID: ${receiverSocketId}`);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("receiveMessage", message);
            console.log(`✅ Tin nhắn đã gửi qua socket cho ${receiver_id} (socket: ${receiverSocketId})`);
        } else {
            console.log(`⚠️ Người nhận ${receiver_id} không online hoặc chưa joinRoom.`);
        }

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