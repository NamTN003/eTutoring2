require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const subjectRoutes = require('./route/subjectRoute');


// Import routes
const userRoutes = require("./route/userRoutes");
const commentRoutes = require("./route/commentRoute");
const blogRoutes = require("./route/blogRoute");
const meetingRoutes = require("./route/meetingRoute");

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:3000", // Địa chỉ frontend
    credentials: true, // Cho phép gửi cookie và thông tin xác thực
}));
app.use(bodyParser.json()); // Xử lý dữ liệu JSON
app.use(bodyParser.urlencoded({ extended: true })); // Xử lý dữ liệu URL-encoded

// Routes
app.use("/user", userRoutes);
app.use("/comments", commentRoutes);
app.use("/blogs", blogRoutes);
app.use("/meeting", meetingRoutes);
app.use('/subject', subjectRoutes);
// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ Kết nối MongoDB thành công!"))
    .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// Trang chủ
app.get("/", (req, res) => {
    res.send("Server đang chạy!");
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});