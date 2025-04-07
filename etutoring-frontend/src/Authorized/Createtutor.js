import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Createtutor.css"; // ✅ Import CSS giao diện đẹp

const Createtutor = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "tutor",
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

            await axios.post("http://localhost:5000/user/create-tutor", formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setMessage("✅ Tạo Gia Sư thành công!");
            setFormData({
                name: "",
                email: "",
                phone: "",
                password: "",
                role: "tutor",
                gender: "",
                address: "",
            });

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
        <div className="createtutor-container">
            <h2>Tạo Gia Sư</h2>
            {message && (
                <p
                    className="createtutor-message"
                    style={{ color: message.includes("✅") ? "green" : "red" }}
                >
                    {message}
                </p>
            )}
            <form onSubmit={handleSubmit}>
            <input
                        type="text"
                        name="name"
                        placeholder="Họ tên"
                        value={formData.name}
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
                        value={formData.email}
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
                        value={formData.phone}
                        onChange={handleChange}
                        maxLength={15}
                        pattern="^\d{0,15}$"
                        title="Chỉ được nhập số, tối đa 15 chữ số"
                        />
                <input type="password" name="password" placeholder="Mật khẩu" value={formData.password} onChange={handleChange} required />

                <select name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Chọn giới tính</option>
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                    <option value="Other">Khác</option>
                </select>

                <input type="text" name="address" placeholder="Địa chỉ" value={formData.address} onChange={handleChange} />

                <button type="submit">Tạo Gia Sư</button>
            </form>
        </div>
    );
};

export default Createtutor;
