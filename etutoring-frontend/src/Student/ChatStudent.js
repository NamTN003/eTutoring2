import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "./ChatStudent.css";

const socket = io("http://localhost:5000");

const ChatStudent = () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [tutorId, setTutorId] = useState(null);
  const [tutorName, setTutorName] = useState("Gia sư");
  const [hasNewMessage, setHasNewMessage] = useState(false); // 👈 Thêm flag kiểm soát scroll
  const messagesEndRef = useRef(null);

  // Lấy thông tin người dùng và tutor
  useEffect(() => {
    if (!userId || !token) return;

    const fetchUserData = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTutorId(data.tutor_id);

        // Lấy tên tutor nếu có
        if (data.tutor_id) {
          const res = await axios.get(`http://localhost:5000/user/${data.tutor_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setTutorName(res.data.name || "Gia sư");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchUserData();
    socket.emit("joinRoom", userId);
  }, [userId, token]);

  // Lấy tin nhắn
  useEffect(() => {
    if (!userId || !tutorId || !token) return;

    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/message/conversation/${userId}?tutor_id=${tutorId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(data || []);
      } catch (error) {
        console.error("Lỗi khi lấy tin nhắn:", error);
      }
    };

    fetchMessages();
    socket.emit("join", { userId, tutorId });

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
      setHasNewMessage(true); // 👈 Cuộn khi có tin nhắn socket
    });

    return () => socket.off("receiveMessage");
  }, [userId, tutorId, token]);

  // Gửi tin nhắn
  const sendMessage = async () => {
    if (!newMessage.trim() || !tutorId) return;

    try {
      const { data } = await axios.post("http://localhost:5000/message/send", {
        sender_id: userId,
        receiver_id: tutorId,
        content: newMessage,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      socket.emit("sendMessage", data.data);
      setMessages((prev) => [...prev, data.data]);
      setNewMessage("");
      setHasNewMessage(true); // 👈 Cuộn khi gửi tin nhắn
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  };

  // Cuộn xuống nếu có tin nhắn mới
  useEffect(() => {
    if (hasNewMessage) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setHasNewMessage(false);
    }
  }, [messages, hasNewMessage]);

  return (
    <div className="chat-container">
      {/* Sidebar - Tutor info */}
      <aside className="chat-sidebar">
        <h2 className="sidebar-title">🎓 Gia sư</h2>
        <div className="student-info-box">
          <p><strong>Tên:</strong> {tutorName}</p>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="chat-main">
        <div className="chat-header">
          💬 Chat với: <strong>{tutorName}</strong>
        </div>

        <div className="chat-messages">
          {messages.length > 0 ? (
            messages.map((msg) => {
              const senderId = msg.sender_id?._id || msg.sender_id;
              const isSender = String(senderId) === String(userId);

              return (
                <div key={msg._id} className={`message ${isSender ? "sent" : "received"}`}>
                  <p className="sender">{isSender ? "Bạn" : tutorName}</p>
                  <p>{msg.content}</p>
                </div>
              );
            })
          ) : (
            <p className="no-message">Chưa có tin nhắn nào.</p>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        <div className="chat-input-container">
          <div className="chat-input">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={!tutorId}
            />
            <button onClick={sendMessage} disabled={!tutorId}>Gửi</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatStudent;
