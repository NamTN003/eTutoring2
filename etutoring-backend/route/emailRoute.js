const express = require('express');
const router = express.Router();
const Email = require("../Models/Email");
const User = require("../Models/User");

router.get('/emails/:recipientId', async (req, res) => {
    const { recipientId } = req.params;
    
    try {
      const emails = await Email.find({ recipientId });
      return res.status(200).json(emails);
    } catch (error) {
      console.error('Error fetching emails for recipient:', error);
      return res.status(500).json({ message: 'Error fetching emails' });
    }
  });
  

  router.post('/send-email', async (req, res) => {
    const { sender, recipientIds, recipientNames, subject, message } = req.body;
    
    try {
      const emailPromises = recipientIds.map(async (recipientId, index) => {
        const newEmail = new Email({
          sender,
          recipientId,
          recipient: recipientNames[index],
          subject,
          message,
        });
        
        await newEmail.save();
      });
  
      await Promise.all(emailPromises);
  
      return res.status(200).json({ message: 'Emails sent successfully!' });
    } catch (error) {
      console.error('Error sending emails:', error);
      return res.status(500).json({ message: 'Error sending emails' });
    }
  });
  

  router.get('/users', async (req, res) => {
    try {
      const users = await User.find({
        role: { $in: ['student', 'tutor'] }
      });
      return res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ message: 'Error fetching users' });
    }
  });

module.exports = router;