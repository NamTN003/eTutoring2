import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const ChatStudent = () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [tutorId, setTutorId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!userId || !token) return;  

    const fetchUserData = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTutorId(data.tutor_id);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error.response?.data || error.message);
      }
    };

    fetchUserData();

    // 🔥 Thêm đoạn emit sự kiện `joinRoom`
    socket.emit("joinRoom", userId);
    console.log(`📡 Đã gửi joinRoom cho userId: ${userId}`);

}, [userId, token]);

  useEffect(() => {
    if (!userId || !tutorId || !token) return;
    
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/message/conversation/${userId}?tutor_id=${tutorId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
    
        console.log("Tin nhắn nhận được:", data);
        setMessages(data || []);
      } catch (error) {
        console.error("Lỗi khi lấy tin nhắn:", error.response?.data || error.message);
      }
    };
    fetchMessages();

    socket.emit("join", { userId, tutorId });

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [userId, tutorId, token]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !tutorId) return;
    
    const messageData = { sender_id: userId, receiver_id: tutorId, content: newMessage };

    try {
        // Gửi tin nhắn qua API để lưu vào database
        const { data } = await axios.post("http://localhost:5000/message/send", messageData, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // Sau khi server lưu thành công, gửi tin nhắn qua socket
        socket.emit("sendMessage", data.data); // `data.data` là tin nhắn từ server đã lưu

        setMessages((prev) => [...prev, data.data]); // Cập nhật UI từ server
        setNewMessage("");
    } catch (error) {
        console.error("❌ Lỗi khi gửi tin nhắn:", error.response?.data || error.message);
    }
};

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!userId || !token) {
    return <p>Vui lòng chọn gia sư để bắt đầu chat</p>;
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-4">
      <h2 className="text-center text-lg font-bold mb-2">💬 Chat với Gia Sư</h2>

      <div className="h-64 overflow-y-auto border-b mb-4 p-2">
        {messages.length > 0 ? (
          messages.map((msg) => {
            const isSender =
              msg.sender_id === userId || msg.sender_id?._id?.toString() === userId.toString();

            return (
              <div
                key={msg._id}
                className={`mb-2 p-2 rounded w-fit ${
                  isSender ? "bg-blue-500 text-white ml-auto" : "bg-gray-200"
                }`}
              >
                <p className="text-sm font-bold">{isSender ? "Bạn" : "Gia sư của bạn"}</p>
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

export default ChatStudent;