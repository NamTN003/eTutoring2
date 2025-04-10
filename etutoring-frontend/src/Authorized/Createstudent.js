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

        const response = await axios.get(`${process.env.REACT_APP_SERVER_HOST}/user/tutors`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTutors(response.data);
      } catch (error) {
        console.error("Unable to fetch tutor list", error);
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
        setMessage("You are not logged in!");
        return;
      }

      await axios.post(`${process.env.REACT_APP_SERVER_HOST}/user/create-student`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("✅ Student created successfully!");
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
        setMessage(`❌ Error: ${error.response.data.message}`);
      } else {
        setMessage("❌ Server connection error.");
      }
    }
  };

  return (
    <div className="createstudent-container">
      <h2>Create Student</h2>
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
          placeholder="Full Name"
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
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          pattern="\d*"
          maxLength="15"
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
        <select
          name="tutor_id"
          value={formData.tutor_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Tutor</option>
          {tutors.map((tutor) => (
            <option key={tutor._id} value={tutor._id}>
              {tutor.name} - {tutor.email}
            </option>
          ))}
        </select>
        <button type="submit">Create Student</button>
      </form>
    </div>
  );
};

export default Createstudent;
