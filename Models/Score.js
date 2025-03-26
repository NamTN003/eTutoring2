const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tutor_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject_id: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    score: { type: Number, min: 0, max: 10, required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  }, { timestamps: true });

const Score = mongoose.model('score', ScoreSchema,'score');
module.exports = Score;
