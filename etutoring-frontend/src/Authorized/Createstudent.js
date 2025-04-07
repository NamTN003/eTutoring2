import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Createstudent.css"; 

const Createstudent = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "student",
        gender: "",
        address: "",
        tutor_id: "",
    });

    const [message, setMessage] = useState("");
    const [tutors, setTutors] = useState([]);

    useEffect(() => {
        const fetchTutors = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const response = await axios.get("http://localhost:5000/user/tutors", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setTutors(response.data);
            } catch (error) {
                console.error("Không thể lấy danh sách gia sư", error);
            }
        };

        fetchTutors();
    }, []);

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

            await axios.post("http://localhost:5000/user/create-student", formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setMessage("✅ Tạo sinh viên thành công!");
            setFormData({
                name: "",
                email: "",
                phone: "",
                password: "",
                role: "student",
                gender: "",
                address: "",
                tutor_id: "",
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
        <div className="createstudent-container">
            <h2>Tạo Sinh Viên</h2>
            {message && (
                <p
                    className="createstudent-message"
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
                    maxLength="30"
                    />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    maxLength="25"
                    />
                <input
                    type="text"
                    name="phone"
                    placeholder="Số điện thoại"
                    value={formData.phone}
                    onChange={handleChange}
                    pattern="\d*"
                    maxLength="15"
                    />
                <input
                    type="password"
                    name="password"
                    placeholder="Mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                >
                    <option value="">Chọn giới tính</option>
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                    <option value="Other">Khác</option>
                </select>
                <input
                    type="text"
                    name="address"
                    placeholder="Địa chỉ"
                    value={formData.address}
                    onChange={handleChange}
                />
                <select
                    name="tutor_id"
                    value={formData.tutor_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">Chọn Gia Sư</option>
                    {tutors.map((tutor) => (
                        <option key={tutor._id} value={tutor._id}>
                            {tutor.name} - {tutor.email}
                        </option>
                    ))}
                </select>
                <button type="submit">Tạo Sinh Viên</button>
            </form>
        </div>
    );
};

export default Createstudent;
