import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ListTutor = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Bạn chưa đăng nhập!");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5000/user/tutors", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTutors(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.message : "Lỗi kết nối server.");
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa gia sư này?")) {
      try {
        await axios.delete(`http://localhost:5000/user/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTutors(tutors.filter((tutor) => tutor._id !== id));
        alert("✅ Xóa gia sư thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa gia sư:", error);
        alert("Không thể xóa gia sư");
      }
    }
  };

  return (
    <div className="list-tutor-container">
      <h2>Danh sách Gia Sư</h2>
      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        tutors.map((tutor) => (
          <div className="tutor-card" key={tutor._id}>
            <div className="tutor-info">
              <strong>{tutor.name}</strong> <br />
              {tutor.email} <br />
              Giới tính: {tutor.gender || "Chưa cập nhật"}
            </div>
            <div className="tutor-actions">
              <Link to={`../edittutor/${tutor._id}`} className="edit-btn">
                ✏ Sửa
              </Link>
              <button className="delete-btn" onClick={() => handleDelete(tutor._id)}>
                🗑 Xóa
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ListTutor;