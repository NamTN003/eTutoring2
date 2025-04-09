const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    recipientId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }],
    recipient: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
});

const Email = mongoose.model('email', EmailSchema,'email');
module.exports = Email;
