import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
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
        localStorage.setItem("role", role);

        alert("✅ Login successful!");

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
      alert("❌ " + (error.response?.data?.message || "Login failed"));
    }
  };

  return (
    <div className="greenwich-login-page">
      <div className="greenwich-login-overlay">
        <img
          src="https://s3-alpha-sig.figma.com/img/4493/f3ee/e7c83b8d7bccea7cc5fba2bd9dc93fdb?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=eJt0-E5IL8jKlJsbkn-NbK8cCAAdQvvEPRrsAn6sQhocFRIX-h7wR9Th0WXNm~cIOBkDO~r3trB8-MmR6G9xwcghb8216TCTIsxVgBhbNygtrJhf8EwxmETGsbgcTgABE8X~jeJZhO9308D2D56NMP0MaVyzX30ILJh93vYrzpBSHt9nU302ISHPiw9K0xOAMOqX9SkugH1ja9Dulwr2ooNcd251ie5FF6FV0796DUd9VVUzQIsIOauBsgus7WvpC9ITcbp3cENFQ1NVY8Ft8lPwt61Vt6rk8vTwtW6IPfArdYHquJPiOijar0a1ki~FEhm1m9OjjKDloAup4xHiTg__"
          alt="University of Greenwich"
          className="greenwich-login-logo"
        />

        <div className="greenwich-login-box">
          <form onSubmit={handleLogin}>
            <div className="greenwich-login-field">
              <span className="greenwich-login-label">Username:</span>
              <input
                type="text"
                placeholder="Enter your username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={25}
              />
            </div>

            <div className="greenwich-login-field">
              <span className="greenwich-login-label">Password:</span>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                maxLength={25}
              />
            </div>

            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
