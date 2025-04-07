import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Createacount.css";

const Createacount = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    gender: "",
    address: "",
    created_by: "",
    tutor_id: "",
    subjects: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      gender: formData.gender || "Male",
      created_by: formData.created_by || null,
      tutor_id: formData.tutor_id || null,
      subjects: formData.subjects
        ? formData.subjects.split(",").map((s) => s.trim())
        : [],
    };

    try {
      console.log("📤 Gửi request đăng ký với dữ liệu:", formattedData);
      const response = await axios.post(
        "http://localhost:5000/user/register",
        formattedData
      );
      alert("✅ Đăng ký thành công!");
      console.log("User mới:", response.data);
      navigate("/homeadmin");
    } catch (error) {
      console.error("❌ Lỗi đăng ký:", error.response?.data || error.message);
      alert("❌ " + (error.response?.data?.message || "Đăng ký thất bại"));
    }
  };

  return (
    <div className="create-account-page">
      <div className="create-account-container">
        <h2>Đăng ký tài khoản mới cho nhân viên</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Họ và Tên"
            onChange={handleChange}
            pattern="^[^\d]+$"
            title="Họ tên không được chứa số"
            maxLength={25}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$"
            title="Email phải là @gmail.com và không quá 25 ký tự"
            maxLength={25}
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Số điện thoại"
            onChange={handleChange}
            maxLength={15}
            pattern="^[0-9]{1,15}$"
            title="Chỉ được nhập số và tối đa 15 chữ số"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            onChange={handleChange}
            maxLength={25}
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Địa chỉ"
            onChange={handleChange}
          />

          <div className="form-group">
            <label>Giới tính:</label>
            <select name="gender" onChange={handleChange}>
              <option></option>
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
              <option value="Other">Khác</option>
            </select>
          </div>

          <div className="form-group">
            <label>Vai trò:</label>
            <select name="role" onChange={handleChange}>
              <option></option>
              <option value="staff">Nhân viên</option>
            </select>
          </div>

          <button type="submit">Đăng ký</button>
        </form>
      </div>
    </div>
  );
};

export default Createacount;
