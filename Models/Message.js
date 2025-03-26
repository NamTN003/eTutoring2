const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    content: { type: String, required: true },
    image_url: { type: String },
    status: { type: String, enum: ["sent", "failed", "read"], default: "sent" }
  }, { timestamps: true });

const Message = mongoose.model('message', MessageSchema,'message');
module.exports = Message;
