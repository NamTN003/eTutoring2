require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const userRoutes = require("./route/userRoutes");
const commentRoutes = require("./route/commentRoute");
const blogRoutes = require("./route/blogRoute");
const subjectRoutes = require('./route/subjectRoute');
const messageRoutes = require("./route/messageRoutes");
const meetingRoutes = require("./route/meetingRoute");
const dashboardRoutes = require("./route/dashboardRoute");
const emailRoutes = require("./route/emailRoute");

const app = express();
const server = http.createServer(app);

const allowedOrigins = [process.env.CLIENT_URL || "http://localhost:3000"];
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
      console.error("❌ Lỗi kết nối MongoDB:", err);
      process.exit(1);
  });

const io = new Server(server, {
    cors: { origin: "http://localhost:3000" }
});

app.set("io", io);

const userSockets = new Map();
app.set("userSockets", userSockets);

io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    socket.on("joinRoom", (userId) => {
        if (!userId) return;
        socket.join(userId);
        userSockets.set(userId, socket.id);
        console.log(`👥 User ${userId} joined room. Hiện tại userSockets:`, userSockets);
    });

    socket.on("sendMessage", (message) => {
        console.log("📩 Gửi tin nhắn:", message);

        const receiverSocketId = userSockets.get(message.receiver_id);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("receiveMessage", message);
            console.log(`📨 Đã gửi tin nhắn tới ${message.receiver_id}`);
        } else {
            console.log(`⚠️ Người nhận ${message.receiver_id} không online.`);
        }
    });

    socket.on("disconnect", () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
        userSockets.forEach((value, key) => {
            if (value === socket.id) {
                userSockets.delete(key);
            }
        });
    });
});

app.use("/user", userRoutes);
app.use("/message", messageRoutes);
app.use("/meeting", meetingRoutes);
app.use("/comments", commentRoutes);
app.use("/blogs", blogRoutes);
app.use('/subject', subjectRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/email", emailRoutes);
app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
    res.send("Server đang chạy!");
});

app.use((err, req, res, next) => {
    console.error("🔥 Lỗi Server:", err.stack);
    res.status(500).json({ message: "Có lỗi xảy ra trên server", error: err.message });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));