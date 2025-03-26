const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["admin", "staff", "authorized", "tutor", "student"], 
    required: true 
  },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  address: { type: String },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, // Ai đã tạo user này
  tutor_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, // Nếu là student, lưu ID tutor
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  requestReason: { type: String, default: null }, 
  requestDate: { type: Date, default: null },
  requestStatus: { type: String, enum: ["pending", "approved", "rejected"], default: null }
}, { timestamps: true });

var User = mongoose.model("user", userSchema, "user");
module.exports = User;