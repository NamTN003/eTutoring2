import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './Studentlist.css'; 

const ListTutor = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You are not logged in!");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_SERVER_HOST}/user/tutors`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTutors(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.message : "Server connection error.");
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this tutor?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_SERVER_HOST}/user/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTutors(tutors.filter((tutor) => tutor._id !== id));
        alert("✅ Tutor deleted successfully!");
      } catch (error) {
        console.error("Error when deleting tutor:", error);
        alert("Cannot delete tutor");
      }
    }
  };

  return (
    <div className="studentlist-container">
      <h2>List of Tutors</h2>
      {loading ? (
        <p className="student-loading">Loading...</p>
      ) : error ? (
        <p className="student-error">{error}</p>
      ) : (
        tutors.map((tutor) => (
          <div className="student-card" key={tutor._id}>
            <div className="student-info">
              <strong>{tutor.name}</strong> <br />
              {tutor.email} <br />
              Giới tính: {tutor.gender || "Not updated yet"}
            </div>
            <div className="student-actions">
              <Link to={`../edittutor/${tutor._id}`} className="edit-btn">
                ✏ Edit
              </Link>
              <button className="delete-btn" onClick={() => handleDelete(tutor._id)}>
                🗑 Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ListTutor;
