const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
    meeting_date: { type: Date, required: true },
    meeting_time: { type: String, required: true },
    end_time: { type: String, required: true },
    tutor_id: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    student_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }],
    subject_id: { type: mongoose.Schema.Types.ObjectId, ref: "subject", required: true },
    location: { type: String, required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },


    attendance: [{
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        status: { type: String, enum: ["present", "absent"], default: "absent" }
    }],

    cancellation_reason: { type: String, default: "" }

}, { timestamps: true });

const Meeting = mongoose.model('meeting', MeetingSchema, 'meeting');
module.exports = Meeting;
