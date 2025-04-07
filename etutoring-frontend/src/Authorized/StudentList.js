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
                    setError("Bạn chưa đăng nhập!");
                    setLoading(false);
                    return;
                }

                const response = await axios.get("http://localhost:5000/user/students-by-creator", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setStudents(response.data);
            } catch (err) {
                setError(err.response ? err.response.data.message : "Lỗi kết nối server.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) {
            try {
                await axios.delete(`http://localhost:5000/user/${id}`);
                setStudents(studentlist.filter((student) => student._id !== id));
                alert("✅ Xóa sinh viên thành công!");
            } catch (error) {
                console.error("Lỗi khi xóa sinh viên:", error);
                alert("Không thể xóa sinh viên");
            }
        }
    };

    return (
        <div className="studentlist-container">
            <h2>Danh sách Sinh Viên</h2>
            {loading ? (
                <p className="student-loading">Đang tải...</p>
            ) : error ? (
                <p className="student-error">{error}</p>
            ) : (
                studentlist.map((student) => (
                    <div className="student-card" key={student._id}>
                    <div className="student-info">
                        <strong>{student.name}</strong> <br />
                        {student.email} <br />
                        Giới tính: {student.gender}
                    </div>

                    <div className="student-actions">
                        <Link to={`../editstudent/${student._id}`} className="edit-btn">
                        ✏ Sửa
                        </Link>
                        <button className="delete-btn" onClick={() => handleDelete(student._id)}>
                        🗑 Xóa
                        </button>
                    </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default StudentList;
