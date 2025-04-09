const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Meeting = require('../../Models/Metting');
const User = require('../../Models/User');
const Subject = require('../../Models/Subject');


router.post("/create", async (req, res) => {
    try {
        const { meeting_date, meeting_time, end_time, tutor_id, student_ids, subject_id, location, created_by } = req.body;

        if (!meeting_date || !meeting_time || !end_time || !tutor_id || !student_ids || !subject_id || !location || !created_by) {
            return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin!" });
        }

        if (!Array.isArray(student_ids) || student_ids.length === 0) {
            return res.status(400).json({ message: "Danh sách học sinh không hợp lệ!" });
        }

        if (new Date(`1970-01-01T${end_time}:00Z`) <= new Date(`1970-01-01T${meeting_time}:00Z`)) {
            return res.status(400).json({ message: "Giờ kết thúc phải sau giờ bắt đầu!" });
        }

        const existingMeetings = await Meeting.find({
            tutor_id,
            meeting_date,
        });

        for (const meeting of existingMeetings) {
            const existingStart = new Date(`1970-01-01T${meeting.meeting_time}:00Z`);
            const existingEnd = new Date(`1970-01-01T${meeting.end_time}:00Z`);
            const newStart = new Date(`1970-01-01T${meeting_time}:00Z`);
            const newEnd = new Date(`1970-01-01T${end_time}:00Z`);

            if (
                (newStart >= existingStart && newStart <= existingEnd) ||
                (newEnd >= existingStart && newEnd <= existingEnd) ||
                (newStart <= existingStart && newEnd >= existingEnd)
            ) {
                return res.status(400).json({ message: "Cuộc họp mới phải cách giờ kết thúc của cuộc họp trước ít nhất 45 phút!" });
            }

            const diff = Math.abs(existingEnd - newStart) / (1000 * 60);
            if (diff < 45) {
                return res.status(400).json({ message: "Cuộc họp mới phải cách giờ kết thúc của cuộc họp trước ít nhất 45 phút!" });
            }
        }

        const newMeeting = new Meeting({
            meeting_date,
            meeting_time,
            end_time,
            tutor_id,
            student_ids,
            subject_id,
            location,
            created_by,
        });

        await newMeeting.save();
        res.status(201).json({ message: "Cuộc họp đã được tạo thành công" });
    } catch (error) {
        console.error(" Lỗi khi tạo cuộc họp:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
});

router.get("/", async (req, res) => {
    try {
        const meetings = await Meeting.find()
            .populate("tutor_id", "name")
            .populate("student_ids", "name")
            .populate("subject_id", "subject_name")
            .populate("created_by", "name");

        res.json(meetings);
        console.log(meetings);

    } catch (error) {
        console.error("Lỗi khi lấy danh sách cuộc họp:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
});

router.put('/:id/attendance', async (req, res) => {
    try {
        const { user_id, status } = req.body;
        const meetingId = req.params.id.trim();

        if (!mongoose.Types.ObjectId.isValid(meetingId)) {
            return res.status(400).json({ error: "ID cuộc họp không hợp lệ!" });
        }
        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).json({ error: "ID người dùng không hợp lệ!" });
        }

        const meeting = await Meeting.findById(meetingId);
        if (!meeting) {
            return res.status(404).json({ message: "Cuộc họp không tồn tại!" });
        }

        const index = meeting.attendance.findIndex(a => a.user_id.toString() === user_id);
        if (index !== -1) {
            meeting.attendance[index].status = status;
        } else {
            meeting.attendance.push({ user_id, status });
        }

        await meeting.save();

        res.status(200).json({ message: "Ghi nhận điểm danh thành công!", meeting });
    } catch (error) {
        console.error(" Lỗi khi cập nhật điểm danh:", error);
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

        if (!mongoose.Types.ObjectId.isValid(meetingId)) {
            return res.status(400).json({ error: "ID cuộc họp không hợp lệ!" });
        }

        const deletedMeeting = await Meeting.findByIdAndDelete(meetingId);

        if (!deletedMeeting) {
            return res.status(404).json({ message: "Không tìm thấy cuộc họp!" });
        }  

        res.status(200).json({ message: "Xóa cuộc họp thành công!" });
    } catch (error) {
        console.error(" Lỗi khi xóa cuộc họp:", error);
        res.status(500).json({ message: "Lỗi server khi xóa cuộc họp!" });
    }
});

module.exports = router;
