import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Createtutor.css";

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
        setMessage("You are not logged in!");
        return;
      }

      await axios.post(`${process.env.REACT_APP_SERVER_HOST}/user/create-tutor`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("✅ Tutor created successfully!");
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
        setMessage(`❌ Error: ${error.response.data.message}`);
      } else {
        setMessage("❌ Server connection error.");
      }
    }
  };

  return (
    <div className="createtutor-container">
      <h2>Create Tutor</h2>
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
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          maxLength={30}
          pattern="^[^\d]+$"
          title="Name must not contain numbers and must be up to 30 characters"
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
          title="Email must end with @gmail.com and be up to 25 characters"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          maxLength={15}
          pattern="^\d{0,15}$"
          title="Only numbers allowed, up to 15 digits"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
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
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />

        <button type="submit">Create Tutor</button>
      </form>
    </div>
  );
};

export default Createtutor;
