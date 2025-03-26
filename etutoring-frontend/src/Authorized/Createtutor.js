import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Createtutor = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "student",
        gender: "",
        address: "",
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setMessage("Bạn chưa đăng nhập!");
                return;
            }

            await axios.post(
                "http://localhost:5000/user/create-tutor",
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setMessage("✅ Tạo Tutor thành công!");
            setFormData({ name: "", email: "", phone: "", password: "", role: "", gender: "", address: "" });
            setTimeout(() => navigate("/homeauthorized"), 2000);
        } catch (error) {
            if (error.response) {
                setMessage(`❌ Lỗi: ${error.response.data.message}`);
            } else {
                setMessage("❌ Lỗi kết nối server.");
            }
        }
    };

    return (
        <div style={{ maxWidth: "500px", margin: "auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
            <h2>Tạo Gia Sư</h2>
            {message && <p style={{ color: message.includes("✅") ? "green" : "red" }}>{message}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Họ tên" value={formData.name} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="text" name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleChange} />
                <input type="password" name="password" placeholder="Mật khẩu" value={formData.password} onChange={handleChange} required />

                <select name="role" value={formData.role} onChange={handleChange} required>
                    <option value="">Chọn vai trò</option>
                    <option value="tutor">Gia Sư</option>
                </select>

                <select name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Chọn giới tính</option>
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                    <option value="Other">Khác</option>
                </select>

                <input type="text" name="address" placeholder="Địa chỉ" value={formData.address} onChange={handleChange} />
                <button type="submit">Tạo Sinh Viên</button>
            </form>
        </div>
    );
};

export default Createtutor;
