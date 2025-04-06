const express = require('express');
const router = express.Router();
const Email = require("../../Models/Email");  // Import Email model
const User = require("../../Models/User");

// Route lấy tất cả email đã gửi
router.get('/emails/:recipientId', async (req, res) => {
    const { recipientId } = req.params;
    
    try {
      // Tìm tất cả các email mà người nhận là recipientId
      const emails = await Email.find({ recipientId });
      return res.status(200).json(emails); // Trả về các email gửi cho người nhận này
    } catch (error) {
      console.error('Error fetching emails for recipient:', error);
      return res.status(500).json({ message: 'Error fetching emails' });
    }
  });
  

  router.post('/send-email', async (req, res) => {
    const { sender, recipientIds, recipientNames, subject, message } = req.body;
    
    try {
      // Lặp qua các recipientIds và gửi email cho từng người nhận
      const emailPromises = recipientIds.map(async (recipientId, index) => {
        const newEmail = new Email({
          sender,
          recipientId,
          recipient: recipientNames[index], // Lấy tên recipient từ mảng recipientNames
          subject,
          message,
        });
        
        await newEmail.save(); // Lưu email cho từng người nhận
      });
  
      await Promise.all(emailPromises); // Chờ tất cả email được gửi thành công
  
      return res.status(200).json({ message: 'Emails sent successfully!' });
    } catch (error) {
      console.error('Error sending emails:', error);
      return res.status(500).json({ message: 'Error sending emails' });
    }
  });
  

  router.get('/users', async (req, res) => {
    try {
      // Lọc chỉ lấy người dùng có role là 'student' hoặc 'tutor'
      const users = await User.find({
        role: { $in: ['student', 'tutor'] }
      });
      return res.status(200).json(users); // Trả về danh sách người dùng
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ message: 'Error fetching users' });
    }
  });

module.exports = router;