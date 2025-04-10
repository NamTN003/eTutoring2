import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TutorEmail.css';

const TutorEmail = () => {
  const recipientId = localStorage.getItem("userId");
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(true);  // State for loading
  const [error, setError] = useState(null);      // State for error handling

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        setLoading(true); // Set loading to true when starting the fetch
        const response = await axios.get(`${process.env.REACT_APP_SERVER_HOST}/email/emails/${recipientId}`);
        setEmails(response.data);
      } catch (error) {
        console.error('Error fetching emails:', error);
        setError("There was an issue fetching your emails. Please try again later.");
      } finally {
        setLoading(false); // Set loading to false once the fetch is complete
      }
    };

    fetchEmails();
  }, [recipientId]);

  return (
    <div className="tutor-email-wrapper">
      <h2 className="tutor-email-title">📥 Tutor's Inbox</h2>

      {loading && <p className="loading-message">Loading your emails...</p>} {/* Loading state */}
      {error && <p className="error-message">{error}</p>} {/* Error handling */}

      {selectedEmail ? (
        <div className="email-detail">
          <button className="back-button" onClick={() => setSelectedEmail(null)}>⬅ Back</button>
          <h3>{selectedEmail.subject}</h3>
          <p><strong>👤 Sender:</strong> {selectedEmail.sender}</p>
          <p><strong>📩 Recipient:</strong> {selectedEmail.recipient}</p>
          <p><strong>🕒 Sent at:</strong> {new Date(selectedEmail.sentAt).toLocaleString()}</p>
          <div className="email-message">
            <strong>Message:</strong>
            <p>{selectedEmail.message}</p>
          </div>
        </div>
      ) : (
        <div className="email-list">
          {emails.length > 0 ? (
            emails.map(email => (
              <div key={email._id} className="email-item" onClick={() => setSelectedEmail(email)}>
                <div className="email-item-header">
                  <span className="email-subject">📌 {email.subject}</span>
                  <span className="email-time">🕒 {new Date(email.sentAt).toLocaleString()}</span>
                </div>
                <p><strong>👤</strong> {email.sender}</p>
                <p><strong>📩</strong> {email.recipient}</p>
              </div>
            ))
          ) : (
            <p className="no-emails">You have no emails at the moment.</p> // No emails message
          )}
        </div>
      )}
    </div>
  );
};

export default TutorEmail;
