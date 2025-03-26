const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    subject_code: { type: String, unique: true, required: true },
    subject_name: { type: String, required: true },
    description: { type: String }
  }, { timestamps: true });

const Subject = mongoose.model('subject', SubjectSchema, "subject");

module.exports = Subject;
