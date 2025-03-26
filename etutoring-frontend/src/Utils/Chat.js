import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Chat = ({ userId, authToken }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [tutorId, setTutorId] = useState(null);
  const messagesEndRef = useRef(null);
  const token = authToken || localStorage.getItem("token");

  useEffect(() => {
    if (!userId || !token) return;

    const fetchUserData = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Tutor ID:", data.tutor_id); // 🛠 Kiểm tra tutor_id
        setTutorId(data.tutor_id); 
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error.response?.data || error.message);
      }
    };

    fetchUserData();
  }, [userId, token]);

  useEffect(() => {
    if (!userId || !token) return;

    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/message/conversation/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(data || []);
      } catch (error) {
        console.error("Lỗi khi lấy tin nhắn:", error.response?.data || error.message);
      }
    };

    fetchMessages();
  }, [userId, token]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    if (!userId || !token || !tutorId) return; // ✅ Đảm bảo tutorId tồn tại

    try {
      const { data } = await axios.post(
        "http://localhost:5000/message/send",
        { receiver_id: tutorId, content: newMessage }, // ✅ Gửi đến tutor
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => [...prev, data.data]);
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
      <h2 className="text-center text-lg font-bold mb-2">💬 Chat</h2>

      <div className="h-64 overflow-y-auto border-b mb-4 p-2">
        {messages.length > 0 ? (
          messages.map((msg, index) => {
            const isSender = String(msg.sender_id) === String(userId);

            return (
              <div
                key={index}
                className={`mb-2 p-2 rounded w-fit ${
                  isSender ? "bg-blue-500 text-white ml-auto" : "bg-gray-200"
                }`}
              >
                <p className="text-sm font-bold">{isSender ? "Bạn" : "Gia sư"}</p>
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
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Gửi
        </button>
      </div>
    </div>
  );
};

export default Chat;