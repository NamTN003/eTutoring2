import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Register.css";

const Register = () => {
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
            created_by: formData.created_by ? formData.created_by : null,
            tutor_id: formData.tutor_id ? formData.tutor_id : null,
            subjects: formData.subjects ? formData.subjects.split(",").map((s) => s.trim()) : []
        };

        try {
            console.log("📤 Gửi request đăng ký với dữ liệu:", formattedData);
            const response = await axios.post("http://localhost:5000/register", formattedData);
            alert("✅ Đăng ký thành công!");
            console.log("User mới:", response.data);
            navigate("/homeadmin");
        } catch (error) {
            console.error("❌ Lỗi đăng ký:", error.response?.data || error.message);
            alert("❌ " + (error.response?.data?.message || "Đăng ký thất bại"));
        }
    };

    return (
        <div className="register-container">
            <h2>Create New Account</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input type="text" name="name" onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" name="password" onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Gender:</label>
                    <select name="gender" onChange={handleChange} required>
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Role:</label>
                    <select name="role" onChange={handleChange} required>
                        <option value="">Select</option>
                        <option value="staff">Staff</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Phone:</label>
                    <input type="text" name="phone" onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Address:</label>
                    <input type="text" name="address" onChange={handleChange} />
                </div>

                <button type="submit" className="register-button">Create New Account</button>

                <p>Login now at here!</p>
                <Link to="/login" className="login-link">SIGN IN</Link>
            </form>
        </div>
    );
};

export default Register;
