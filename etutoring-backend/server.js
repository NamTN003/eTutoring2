// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const subjectRoutes = require('./route/subjectRoute');


// // Import routes
// const userRoutes = require("./route/userRoutes");
// const commentRoutes = require("./route/commentRoute");
// const blogRoutes = require("./route/blogRoute");
// const meetingRoutes = require("./route/meetingRoute");
// const emailRoutes = require("./route/emailRoute");

// const app = express();

// // Middleware
// app.use(cors({
//     origin: "http://localhost:3000", // Địa chỉ frontend
//     credentials: true, // Cho phép gửi cookie và thông tin xác thực
// }));
// app.use(bodyParser.json()); // Xử lý dữ liệu JSON
// app.use(bodyParser.urlencoded({ extended: true })); // Xử lý dữ liệu URL-encoded

// // Routes
// app.use("/user", userRoutes);
// app.use("/comments", commentRoutes);
// app.use("/blogs", blogRoutes);
// app.use("/meeting", meetingRoutes);
// app.use('/subject', subjectRoutes);
// app.use('/uploads', express.static('uploads'));
// app.use("/email", emailRoutes);
// // Kết nối MongoDB
// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//     .then(() => console.log("✅ Kết nối MongoDB thành công!"))
//     .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// // Trang chủ
// app.get("/", (req, res) => {
//     res.send("Server đang chạy!");
// });

// // Khởi động server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
// });



require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http"); // Import http để dùng với socket.io
const { Server } = require("socket.io");

// Import routes
const userRoutes = require("./route/userRoutes");
const commentRoutes = require("./route/commentRoute");
const blogRoutes = require("./route/blogRoute");
const subjectRoutes = require('./route/subjectRoute');
const messageRoutes = require("./route/messageRoutes");
const meetingRoutes = require("./route/meetingRoute");
const dashboardRoutes = require("./route/dashboardRoute");
const emailRoutes = require("./route/emailRoute");

const app = express();
const server = http.createServer(app); // Tạo server HTTP từ Express

// Cấu hình CORS
const allowedOrigins = [process.env.CLIENT_URL || "http://localhost:3000"];
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

app.use(express.json()); // Cho phép xử lý dữ liệu JSON

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
      console.error("❌ Lỗi kết nối MongoDB:", err);
      process.exit(1);
  });

// Khởi tạo socket.io server
const io = new Server(server, {
    cors: { origin: "http://localhost:3000" } // React chạy trên port 3000
});

app.set("io", io);

const userSockets = new Map();
app.set("userSockets", userSockets); // Lưu userId - socketId

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

// Routes
app.use("/user", userRoutes);
app.use("/message", messageRoutes);
app.use("/meeting", meetingRoutes);
app.use("/comments", commentRoutes);
app.use("/blogs", blogRoutes);
app.use('/subject', subjectRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/email", emailRoutes);
app.use('/uploads', express.static('uploads'));

// Trang chủ
app.get("/", (req, res) => {
    res.send("Server đang chạy!");
});

// Middleware xử lý lỗi chung
app.use((err, req, res, next) => {
    console.error("🔥 Lỗi Server:", err.stack);
    res.status(500).json({ message: "Có lỗi xảy ra trên server", error: err.message });
});

// Khởi động server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));