import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TutorEmail = () => {
    const recipientId = localStorage.getItem("userId");
      const [emails, setEmails] = useState([]);
    
      useEffect(() => {
        const fetchEmails = async () => {
          try {
            // Truyền recipientId vào URL
            const response = await axios.get(`http://localhost:5000/email/emails/${recipientId}`);
            setEmails(response.data);  // Lưu danh sách email vào state
          } catch (error) {
            console.error('Error fetching emails:', error);
          }
        };
    
        fetchEmails();
      }, [recipientId]); // Mỗi khi recipientId thay đổi, useEffect sẽ được gọi lại
    
      return (
        <div>
          <h2>Emails Sent</h2>
          <ul>
            {emails.map((email) => (
              <li key={email._id}>
                <strong>Subject: {email.subject}</strong>
                <p>From: {email.sender} To: {email.recipient}</p>
                <p>{email.message}</p>
                <p><em>Sent at: {new Date(email.sentAt).toLocaleString()}</em></p>
              </li>
            ))}
          </ul>
        </div>
      );
    };

export default TutorEmail;