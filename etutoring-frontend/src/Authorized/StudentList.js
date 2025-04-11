import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './Studentlist.css';

const StudentList = () => {
    const [studentlist, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 3;

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

    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = studentlist.slice(indexOfFirstStudent, indexOfLastStudent);
    const totalPages = Math.ceil(studentlist.length / studentsPerPage);

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const goToPrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="studentlist-container">
            <h2>List of Students</h2>
            {loading ? (
                <p className="student-loading">Loading...</p>
            ) : error ? (
                <p className="student-error">{error}</p>
            ) : (
                <>
                    {currentStudents.map((student) => (
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
                    ))}

                    <div className="pagination-controls">
                        <button onClick={goToPrevPage} disabled={currentPage === 1}>
                            ◀ Prev
                        </button>
                        <span> Page {currentPage} of {totalPages} </span>
                        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
                            Next ▶
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default StudentList;
