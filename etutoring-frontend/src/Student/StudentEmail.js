import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StudentEmail.css';

const StudentEmail = () => {
  const recipientId = localStorage.getItem("userId");
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/email/emails/${recipientId}`);
        setEmails(response.data);
      } catch (error) {
        console.error('Error loading emails:', error);
      }
    };

    fetchEmails();
  }, [recipientId]);

  return (
    <div className="email-wrapper">
      <h1>📬 Student Inbox</h1>

      {selectedEmail ? (
        <div className="email-detail">
          <button className="back-button" onClick={() => setSelectedEmail(null)}>⬅ Back</button>
          <h2>{selectedEmail.subject}</h2>
          <div className="meta">
            <p><strong>👤 Sender:</strong> {selectedEmail.sender}</p>
            <p><strong>📨 Recipient:</strong> {selectedEmail.recipient}</p>
            <p><strong>🕒 Time:</strong> {new Date(selectedEmail.sentAt).toLocaleString()}</p>
          </div>
          <div className="message-box">
            <strong>Message:</strong>
            <p>{selectedEmail.message}</p>
          </div>
        </div>
      ) : (
        <div className="email-list">
          {emails.map((email) => (
            <div className="email-item" key={email._id} onClick={() => setSelectedEmail(email)}>
              <h2>📌 {email.subject}</h2>
              <div className="meta">
                <span>🕒 {new Date(email.sentAt).toLocaleString()}</span>
                <span>👤 {email.sender}</span>
                <span>📩 {email.recipient}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentEmail;
