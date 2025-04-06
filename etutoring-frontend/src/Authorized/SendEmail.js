import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SendEmail = () => {
  const [sender, setSender] = useState('');
  const [recipientIds, setRecipientIds] = useState([]); // Lưu mảng các recipientId
  const [recipientNames, setRecipientNames] = useState([]); // Lưu tên các recipient đã chọn
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Lấy danh sách tất cả sinh viên và gia sư
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/email/users');
        setUsers(response.data); // Lưu danh sách người dùng vào state
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleRecipientChange = (e) => {
    const selectedIds = Array.from(e.target.selectedOptions, option => option.value); // Lấy các recipientId đã chọn
    setRecipientIds(selectedIds);
    const selectedNames = users.filter(user => selectedIds.includes(user._id)).map(user => user.name); // Lấy tên của các recipient đã chọn
    setRecipientNames(selectedNames);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/email/send-email', {
        sender,          // Gửi sender
        recipientIds,    // Gửi mảng recipientIds
        recipientNames,  // Gửi mảng tên recipient
        subject,         // Gửi subject
        message,         // Gửi message
      });
      setStatus('Email sent successfully!');
    } catch (error) {
      setStatus('Error sending email');
    }
  };

  return (
    <div>
      <h2>Send Email</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Sender:</label>
          <input
            type="text"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Recipients:</label>
          <select
            multiple // Cho phép chọn nhiều người
            value={recipientIds}
            onChange={handleRecipientChange}
            required
          >
            {users.map(user => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send Email</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default SendEmail;