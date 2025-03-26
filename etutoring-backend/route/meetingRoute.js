const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Meeting = require('../../Models/Metting');
const User = require('../../Models/User');
const Subject = require('../../Models/Subject');

// 📌 1️⃣ Tạo một cuộc họp mới
router.post("/create", async (req, res) => {
    try {
        console.log("📥 Dữ liệu nhận từ client:", req.body); // Log dữ liệu nhận vào
        
        // Lấy dữ liệu từ request
        const { meeting_date, meeting_time, tutor_id, student_ids, subject_id, location, created_by } = req.body;

        // 🛑 Kiểm tra nếu thiếu trường nào thì báo lỗi
        if (!meeting_date || !meeting_time || !tutor_id || !student_ids || !subject_id || !location || !created_by) {
            console.log("⚠️ Thiếu dữ liệu:", req.body);
            return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin!" });
        }

        if (!Array.isArray(student_ids) || student_ids.length === 0) {
            return res.status(400).json({ message: "Danh sách học sinh không hợp lệ!" });
        }

        // 🟢 Tạo cuộc họp với nhiều học sinh
        const newMeeting = new Meeting({
            meeting_date,
            meeting_time,
            tutor_id,
            student_ids,
            subject_id,
            location,
            created_by,
        });

        await newMeeting.save(); // Lưu vào database
        console.log("✅ Cuộc họp đã được tạo thành công");
        res.status(201).json({ message: "Cuộc họp đã được tạo thành công" });

    } catch (error) {
        console.error("❌ Lỗi khi tạo cuộc họp:", error); // Log lỗi chi tiết
        res.status(500).json({ message: "Lỗi khi tạo cuộc họp!", error });
    }
});

router.get("/", async (req, res) => {
    try {
        const meetings = await Meeting.find()
            .populate("tutor_id", "name")
            .populate("student_ids", "name") // Sửa student_id thành student_ids
            
            .populate("created_by", "name");

        res.json(meetings);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách cuộc họp:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
});

// 📌 4️⃣ Ghi nhận sự có mặt của người tham gia
router.put('/:id/attendance', async (req, res) => {
    try {
        const { user_id, status } = req.body;
        const meetingId = req.params.id.trim();

        // 🛑 Kiểm tra `id` có hợp lệ không
        if (!mongoose.Types.ObjectId.isValid(meetingId)) {
            return res.status(400).json({ error: "ID cuộc họp không hợp lệ!" });
        }
        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).json({ error: "ID người dùng không hợp lệ!" });
        }

        // 🟢 Tìm cuộc họp
        const meeting = await Meeting.findById(meetingId);
        if (!meeting) {
            return res.status(404).json({ message: "Cuộc họp không tồn tại!" });
        }

        // 🔍 Tìm xem user có trong danh sách điểm danh chưa
        const index = meeting.attendance.findIndex(a => a.user_id.toString() === user_id);
        if (index !== -1) {
            meeting.attendance[index].status = status;
        } else {
            meeting.attendance.push({ user_id, status });
        }

        // 💾 Lưu vào database
        await meeting.save();

        res.status(200).json({ message: "Ghi nhận điểm danh thành công!", meeting });
    } catch (error) {
        console.error("❌ Lỗi khi cập nhật điểm danh:", error);
        res.status(500).json({ message: "Lỗi khi cập nhật điểm danh!", error });
    }
});


router.get("/:id", async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id)
            .populate("tutor_id", "name")
            .populate("student_ids", "name")
            .populate("created_by", "name");

        if (!meeting) {
            return res.status(404).json({ message: "Không tìm thấy cuộc họp!" });
        }

        res.status(200).json(meeting);
    } catch (error) {
        console.error("Lỗi khi lấy cuộc họp:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const meetingId = req.params.id.trim();

        // 🛑 Kiểm tra ID hợp lệ không
        if (!mongoose.Types.ObjectId.isValid(meetingId)) {
            return res.status(400).json({ error: "ID cuộc họp không hợp lệ!" });
        }

        // ❌ Xóa cuộc họp
        const deletedMeeting = await Meeting.findByIdAndDelete(meetingId);

        if (!deletedMeeting) {
            return res.status(404).json({ message: "Không tìm thấy cuộc họp!" });
        }

        res.status(200).json({ message: "Xóa cuộc họp thành công!" });
    } catch (error) {
        console.error("❌ Lỗi khi xóa cuộc họp:", error);
        res.status(500).json({ message: "Lỗi server khi xóa cuộc họp!" });
    }
});

module.exports = router;
