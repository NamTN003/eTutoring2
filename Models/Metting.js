const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
    meeting_date: { type: Date, required: true }, // Ngày họp
    meeting_time: { type: String, required: true }, // Giờ họp
    tutor_id: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, // Gia sư
    student_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }], // Học sinh
    subject_id: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true }, // Môn học
    location: { type: String, required: true }, // Địa điểm hoặc link họp online
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, // Người tạo cuộc họp

    // Ghi nhận người tham gia
    attendance: [{
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        status: { type: String, enum: ["present", "absent"], default: "absent" }
    }],

    // Lý do hủy (nếu có)
    cancellation_reason: { type: String, default: "" }

}, { timestamps: true });

const Meeting = mongoose.model('meeting', MeetingSchema, 'meeting');
module.exports = Meeting;
