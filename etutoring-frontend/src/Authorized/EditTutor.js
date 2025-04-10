import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Editstudent.css";

const EditTutor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    address: ""
  });

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_HOST}/user/${id}`);
        setTutor(response.data);
      } catch (error) {
        console.error("❌ Error fetching tutor info:", error);
      }
    };
    fetchTutor();
  }, [id]);

  const handleChange = (e) => {
    setTutor({ ...tutor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.REACT_APP_SERVER_HOST}/user/${id}`, tutor);
      alert("✅ Tutor updated successfully!");
      navigate("/homeauthorized/listtutor");
    } catch (error) {
      console.error("❌ Error updating tutor:", error);
      alert("❌ Failed to update tutor");
    }
  };

  return (
    <div className="editstudent-container">
      <h2>Edit Tutor</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={tutor.name}
          onChange={handleChange}
          required
          maxLength={30}
          pattern="^[^\d]+$"
          title="Name should not contain numbers and must be up to 30 characters"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={tutor.email}
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
          value={tutor.phone}
          onChange={handleChange}
          maxLength={15}
          pattern="^\d{0,15}$"
          title="Only numbers allowed, up to 15 digits"
        />
        <select name="gender" value={tutor.gender} onChange={handleChange}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={tutor.address}
          onChange={handleChange}
        />
        <button type="submit">Update</button>
        <button type="button" onClick={() => navigate("/homeauthorized/listtutor")}>Cancel</button>
      </form>
    </div>
  );
};

export default EditTutor;
