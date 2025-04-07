import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SendEmail.css';

const SendEmail = () => {
  const [sender, setSender] = useState('');
  const [recipientIds, setRecipientIds] = useState([]);
  const [recipientNames, setRecipientNames] = useState([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/email/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleCheckboxChange = (userId, name) => {
    if (recipientIds.includes(userId)) {
      setRecipientIds(recipientIds.filter(id => id !== userId));
      setRecipientNames(recipientNames.filter(n => n !== name));
    } else {
      setRecipientIds([...recipientIds, userId]);
      setRecipientNames([...recipientNames, name]);
    }
  };

  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      const allIds = users.map(user => user._id);
      const allNames = users.map(user => user.name);
      setRecipientIds(allIds);
      setRecipientNames(allNames);
    } else {
      setRecipientIds([]);
      setRecipientNames([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/email/send-email', {
        sender,
        recipientIds,
        recipientNames,
        subject,
        message,
      });
      setStatus('✅ Gửi email thành công!');
    } catch (error) {
      setStatus('❌ Gửi email thất bại.');
    }
  };

  return (
    <div className="sendemail-container">
      <h2>📨 Gửi Email</h2>
      <form onSubmit={handleSubmit} className="sendemail-form">
        <div className="form-group">
          <label>Người gửi:</label>
          <input
            type="text"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Người nhận:</label>
                  <div className="recipient-list">
          <label className="recipient-item select-all-item">
            <span>Chọn tất cả</span>
            <input
              type="checkbox"
              onChange={handleSelectAllChange}
              checked={users.length > 0 && recipientIds.length === users.length}
            />
          </label>

          {users.map(user => (
            <label key={user._id} className="recipient-item">
              <span>{user.name} - {user.email}</span>
              <input
                type="checkbox"
                checked={recipientIds.includes(user._id)}
                onChange={() => handleCheckboxChange(user._id, user.name)}
              />
            </label>
          ))}
        </div>

        </div>

        <div className="form-group">
          <label>Tiêu đề:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Nội dung:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        <button type="submit">Gửi Email</button>
        {status && <p className="email-status">{status}</p>}
      </form>
    </div>
  );
};

export default SendEmail;
