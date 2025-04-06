import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Kết nối đến server socket

const ChatTutor = () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!userId || !token) return;

    const fetchStudents = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/user/students?tutor_id=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sinh viên:", error.response?.data || error.message);
      }
    };

    fetchStudents();
  }, [userId, token]);

  useEffect(() => {
    if (!selectedStudent) return;

    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/message/conversation/${selectedStudent}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(data || []);
      } catch (error) {
        console.error("Lỗi khi lấy tin nhắn:", error.response?.data || error.message);
      }
    };

    fetchMessages();
  }, [selectedStudent, token]);

  // Lắng nghe tin nhắn mới từ socket
  useEffect(() => {
    socket.emit("joinRoom", userId); // Gửi ID user để join đúng phòng

    socket.on("receiveMessage", (message) => {
        console.log("📩 Tin nhắn mới nhận được:", message);
        setMessages((prevMessages) => [...prevMessages, message]); // Cập nhật UI
    });

    return () => {
        socket.off("receiveMessage");
    };
}, []);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedStudent) return;

    try {
      const { data } = await axios.post(
        "http://localhost:5000/message/send",
        { receiver_id: selectedStudent, content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => [...prev, data.data]);

      // Gửi tin nhắn đến socket server
      socket.emit("send_message", data.data);

      setNewMessage("");
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-4">
      <h2 className="text-center text-lg font-bold mb-2">💬 Chat với sinh viên</h2>

      <select
        className="w-full p-2 border rounded-lg mb-4"
        onChange={(e) => setSelectedStudent(e.target.value)}
        value={selectedStudent || ""}
      >
        <option value="" disabled>Chọn sinh viên</option>
        {students.map((student) => (
          <option key={student._id || student.id} value={student._id || student.id}>
            {student.name}
          </option>
        ))}
      </select>

      <div className="h-64 overflow-y-auto border-b mb-4 p-2">
        {messages.length > 0 ? (
          messages.map((msg, index) => {

            const senderId = msg.sender_id?._id || msg.sender_id; // Lấy _id nếu sender_id là object
            const isSender = String(senderId) === String(userId);

            return (
              <div
                key={index}
                className={`mb-2 p-2 rounded w-fit ${isSender ? "bg-blue-500 text-white ml-auto" : "bg-gray-200"}`}
              >
                <p className="text-sm font-bold">{isSender ? "Bạn" : "Sinh viên"}</p>
                <p>{msg.content}</p>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">Chưa có tin nhắn nào.</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg"
          placeholder="Nhập tin nhắn..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          disabled={!selectedStudent}
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatTutor;