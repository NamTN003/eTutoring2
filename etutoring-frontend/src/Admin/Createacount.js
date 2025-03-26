import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Createacount.css';  // Import the CSS file

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
        created_by: "",   // ID người tạo (nếu có)
        tutor_id: "",     // ID tutor (nếu là student)
        subjects: "",     // Danh sách môn học (cách nhau bởi dấu phẩy)
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formattedData = {
            ...formData,
            gender: formData.gender || "Male",
            created_by: formData.created_by ? formData.created_by : null,  // Đặt null nếu rỗng
            tutor_id: formData.tutor_id ? formData.tutor_id : null,        // Đặt null nếu rỗng
            subjects: formData.subjects ? formData.subjects.split(",").map((s) => s.trim()) : []
        };
    
        try {
            console.log("📤 Gửi request đăng ký với dữ liệu:", formattedData);
            const response = await axios.post("http://localhost:5000/user/register", formattedData);
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
                    <input type="text" name="name" placeholder="Họ và Tên" onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                    <input type="text" name="phone" placeholder="Số điện thoại" onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Mật khẩu" onChange={handleChange} required />
                    <input type="text" name="address" placeholder="Địa chỉ" onChange={handleChange} />

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
