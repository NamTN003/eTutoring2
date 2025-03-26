import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Thêm Link
import axios from "axios";
import "./Login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/user/login", {
                email,
                password,
            });

            if (response.status === 200) {
                const { token, userId, role } = response.data;
                localStorage.setItem("userId", userId);
                localStorage.setItem("token", token);

                alert("✅ Đăng nhập thành công!");

                if (role === "admin") {
                    navigate("/homeadmin");
                } else if (role === "student") {
                    navigate("/homestudent");
                } else if (role === "tutor") {
                    navigate("/hometutor");
                } else if (role === "staff") {
                    navigate("/homestaff");
                } else if (role === "authorized") {
                    navigate("/homeauthorized");
                } else {
                    navigate("/");
                }
            }
        } catch (error) {
            alert("❌ " + (error.response?.data?.message || "Đăng nhập thất bại"));
        }
    };

    return (
        <div className="login-page">
            <div className="logo-container">
                <img 
                    src="https://fpt.edu.vn/Content/images/assets/2022-Greenwich-Eng.jpg" 
                    alt="Greenwich Logo" 
                    className="logo"
                />
            </div>

            <div className="login-container">
                <h2>Sign In</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button type="submit">SIGN IN</button>
                    
                </form>
            </div>
        </div>
    );
};

export default Login;
