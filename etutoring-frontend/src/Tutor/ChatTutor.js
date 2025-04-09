import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "./ChatTutor.css";

const socket = io("http://localhost:5000");

const ChatTutor = () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [justSent, setJustSent] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!userId || !token) return;

    const fetchStudents = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/user/students?tutor_id=${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStudents(data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sinh viên:", error);
      }
    };

    fetchStudents();
  }, [userId, token]);

  useEffect(() => {
    if (!selectedStudent) return;

    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/message/conversation/${selectedStudent}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(data || []);
      } catch (error) {
        console.error("Lỗi khi lấy tin nhắn:", error);
      }
    };

    fetchMessages();
  }, [selectedStudent, token]);


  useEffect(() => {
    socket.emit("joinRoom", userId);
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
      setJustSent(true);
    });
    return () => socket.off("receiveMessage");
  }, [userId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedStudent) return;
    try {
      const { data } = await axios.post(
        "http://localhost:5000/message/send",
        { receiver_id: selectedStudent, content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => [...prev, data.data]);
      socket.emit("send_message", data.data);
      setNewMessage("");
      setJustSent(true);
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  };

  useEffect(() => {
    if (justSent) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setJustSent(false);
    }
  }, [messages, justSent]);

  return (
    <div className="chat-container">
      <aside className="chat-sidebar">
        <h2 className="sidebar-title">👥 Sinh viên</h2>
        <ul className="student-list">
          {students.map((student) => (
            <li
              key={student._id}
              onClick={() => setSelectedStudent(student._id)}
              className={selectedStudent === student._id ? "active" : ""}
            >
              {student.name}
            </li>
          ))}
        </ul>
      </aside>

      <main className="chat-main">
        <div className="chat-header">
          💬 Chat với:{" "}
          <strong>
            {selectedStudent
              ? students.find((s) => s._id === selectedStudent)?.name || "Đang tải..."
              : "Chọn sinh viên"}
          </strong>
        </div>

        <div className="chat-messages">
          {messages.length > 0 ? (
            messages.map((msg, index) => {
              const senderId = msg.sender_id?._id || msg.sender_id;
              const isSender = String(senderId) === String(userId);
              return (
                <div key={index} className={`message ${isSender ? "sent" : "received"}`}>
                  <p className="sender">{isSender ? "Bạn" : "Sinh viên"}</p>
                  <p className="content">{msg.content}</p>
                </div>
              );
            })
          ) : (
            <p className="no-message">Chưa có tin nhắn nào.</p>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-container">
          <div className="chat-input">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={!selectedStudent}
            />
            <button onClick={sendMessage} disabled={!selectedStudent}>
              Gửi
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatTutor;
