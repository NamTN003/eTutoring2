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
      alert("✅ Registration successful!");
      console.log("User mới:", response.data);
      navigate("/homeadmin");
    } catch (error) {
      console.error("❌ Registration error:", error.response?.data || error.message);
      alert("❌ " + (error.response?.data?.message || "Registration failed"));
    }
  };

  return (
    <div className="create-account-page">
      <div className="create-account-container">
        <h2>Register new account for employee</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            pattern="^[^\d]+$"
            title="Name cannot contain numbers"
            maxLength={25}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$"
            title="Email must be @gmail.com and no more than 25 characters"
            maxLength={25}
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone number"
            onChange={handleChange}
            maxLength={15}
            pattern="^[0-9]{1,15}$"
            title="Only numbers and maximum 15 digits allowed"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="password"
            onChange={handleChange}
            maxLength={25}
            required
          />

          <input
            type="text"
            name="address"
            placeholder="address"
            onChange={handleChange}
          />

          <div className="form-group">
            <label>Gender:</label>
            <select name="gender" onChange={handleChange}>
              <option></option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Role:</label>
            <select name="role" onChange={handleChange}>
              <option></option>
              <option value="staff">Staff</option>
            </select>
          </div>

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Createacount;
