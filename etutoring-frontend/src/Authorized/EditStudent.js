import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Editstudent.css";

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    address: ""
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_HOST}/user/${id}`);
        setStudent(response.data);
      } catch (error) {
        console.error("❌ Error fetching student info:", error);
      }
    };
    fetchStudent();
  }, [id]);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.REACT_APP_SERVER_HOST}/user/user/${id}`, student);
      alert("✅ Student updated successfully!");
      navigate("/homeauthorized/studentlist");
    } catch (error) {
      console.error("❌ Error updating student:", error);
      alert("❌ Failed to update student");
    }
  };

  return (
    <div className="editstudent-container">
      <h2>Edit Student</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={student.name}
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
          value={student.email}
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
          value={student.phone}
          onChange={handleChange}
          maxLength={15}
          pattern="^\d{0,15}$"
          title="Only numbers allowed, up to 15 digits"
        />
        <select name="gender" value={student.gender} onChange={handleChange}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={student.address}
          onChange={handleChange}
        />
        <button type="submit">Update</button>
        <button type="button" onClick={() => navigate("/homeauthorized/studentlist")}>Cancel</button>
      </form>
    </div>
  );
};

export default EditStudent;
