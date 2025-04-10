import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './Studentlist.css';

const StudentList = () => {
    const [studentlist, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("You are not logged in!");
                    setLoading(false);
                    return;
                }

                const response = await axios.get("http://localhost:5000/user/students-by-creator", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setStudents(response.data);
            } catch (err) {
                setError(err.response ? err.response.data.message : "Server connection error.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            try {
                await axios.delete(`http://localhost:5000/user/${id}`);
                setStudents(studentlist.filter((student) => student._id !== id));
                alert("✅ Student deleted successfully!");
            } catch (error) {
                console.error("Error while deleting student:", error);
                alert("Cannot delete student");
            }
        }
    };

    return (
        <div className="studentlist-container">
            <h2>List of Students</h2>
            {loading ? (
                <p className="student-loading">Loading...</p>
            ) : error ? (
                <p className="student-error">{error}</p>
            ) : (
                studentlist.map((student) => (
                    <div className="student-card" key={student._id}>
                    <div className="student-info">
                        <strong>{student.name}</strong> <br />
                        {student.email} <br />
                        Gender: {student.gender}
                    </div>

                    <div className="student-actions">
                        <Link to={`../editstudent/${student._id}`} className="edit-btn">
                        ✏ Edit
                        </Link>
                        <button className="delete-btn" onClick={() => handleDelete(student._id)}>
                        🗑 Delete
                        </button>
                    </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default StudentList;
