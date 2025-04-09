import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TutorEmail.css';

const TutorEmail = () => {
  const recipientId = localStorage.getItem("userId");
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/email/emails/${recipientId}`);
        setEmails(response.data);
      } catch (error) {
        console.error('Error fetching emails:', error);
      }
    };

    fetchEmails();
  }, [recipientId]);

  return (
    <div className="tutor-email-wrapper">
      <h2 className="tutor-email-title">📥 Hộp Thư Gia Sư</h2>

      {selectedEmail ? (
        <div className="email-detail">
          <button className="back-button" onClick={() => setSelectedEmail(null)}>⬅ Quay lại</button>
          <h3>{selectedEmail.subject}</h3>
          <p><strong>👤 Người gửi:</strong> {selectedEmail.sender}</p>
          <p><strong>📩 Người nhận:</strong> {selectedEmail.recipient}</p>
          <p><strong>🕒 Gửi lúc:</strong> {new Date(selectedEmail.sentAt).toLocaleString()}</p>
          <div className="email-message">
            <strong>Nội dung:</strong>
            <p>{selectedEmail.message}</p>
          </div>
        </div>
      ) : (
        <div className="email-list">
          {emails.map(email => (
            <div key={email._id} className="email-item" onClick={() => setSelectedEmail(email)}>
              <div className="email-item-header">
                <span className="email-subject">📌 {email.subject}</span>
                <span className="email-time">🕒 {new Date(email.sentAt).toLocaleString()}</span>
              </div>
              <p><strong>👤</strong> {email.sender}</p>
              <p><strong>📩</strong> {email.recipient}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TutorEmail;
