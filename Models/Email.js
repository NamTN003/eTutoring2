const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
    sender: { type: String, required: true }, // Người gửi
    recipient: { type: String, required: true }, // Người nhận
    subject: { type: String, required: true }, // Tiêu đề
    message: { type: String, required: true }, // Nội dung
    sentAt: { type: Date, default: Date.now }, // Thời gian gửi
    status: { type: String, enum: ['sent', 'failed', 'pending'], default: 'pending' } // Trạng thái
});

const Email = mongoose.model('email', EmailSchema,'email');
module.exports = Email;
