const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
    sender: { type: String, required: true }, // Người gửi
    recipientId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }], // Mảng các ID người nhận (sinh viên hoặc gia sư)
    recipient: { type: String, required: true }, // Người nhận
    subject: { type: String, required: true }, // Tiêu đề
    message: { type: String, required: true }, // Nội dung
    sentAt: { type: Date, default: Date.now }, // Thời gian gửi
});

const Email = mongoose.model('email', EmailSchema,'email');
module.exports = Email;
