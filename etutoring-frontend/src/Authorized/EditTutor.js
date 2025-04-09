import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Editstudent.css";

const EditTutor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    address: ""
  });

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/${id}`);
        setTutor(response.data);
      } catch (error) {
        console.error("❌ Lỗi khi lấy thông tin gia sư:", error);
      }
    };
    fetchTutor();
  }, [id]);

  const handleChange = (e) => {
    setTutor({ ...tutor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/user/${id}`, tutor);
      alert("✅ Cập nhật gia sư thành công!");
      navigate("/homeauthorized/listtutor");
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật gia sư:", error);
      alert("❌ Không thể cập nhật gia sư");
    }
  };

  return (
    <div className="editstudent-container">
      <h2>Chỉnh sửa Gia Sư</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Họ tên"
          value={tutor.name}
          onChange={handleChange}
          required
          maxLength={30}
          pattern="^[^\d]+$"
          title="Họ tên không được chứa số và tối đa 30 ký tự"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={tutor.email}
          onChange={handleChange}
          required
          maxLength={25}
          pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$"
          title="Email phải có đuôi @gmail.com và tối đa 25 ký tự"
        />
        <input
          type="text"
          name="phone"
          placeholder="Số điện thoại"
          value={tutor.phone}
          onChange={handleChange}
          maxLength={15}
          pattern="^\d{0,15}$"
          title="Chỉ được nhập số, tối đa 15 chữ số"
        />
        <select name="gender" value={tutor.gender} onChange={handleChange}>
          <option value="Male">Nam</option>
          <option value="Female">Nữ</option>
          <option value="Other">Khác</option>
        </select>
        <input
          type="text"
          name="address"
          placeholder="Địa chỉ"
          value={tutor.address}
          onChange={handleChange}
        />
        <button type="submit">Cập nhật</button>
        <button type="button" onClick={() => navigate("/homeauthorized/listtutor")}>Hủy</button>
      </form>
    </div>
  );
};

export default EditTutor;
