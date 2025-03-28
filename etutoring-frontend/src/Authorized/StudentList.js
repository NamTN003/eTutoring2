import React, { useEffect, useState } from "react";
import axios from "axios"; // ✅ Import Axios
import { Link } from "react-router-dom";

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

                // ✅ Gửi request bằng Axios
                const response = await axios.get("http://localhost:5000/user/students-by-creator", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setStudents(response.data); // Lưu danh sách sinh viên vào state

            } catch (err) {
                setError(err.response ? err.response.data.message : "Lỗi kết nối server.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
            try {
                await axios.delete(`http://localhost:5000/user/${id}`);
                setStudents(studentlist.filter((student) => student._id !== id));
                alert("✅ Xóa nhân viên thành công!");
            } catch (error) {
                console.error(" Lỗi khi xóa nhân viên:", error);
                alert(" Không thể xóa nhân viên");
            }
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
            <h2>Danh sách Sinh Viên</h2>
            {loading ? <p>Đang tải...</p> : error ? <p style={{ color: "red" }}>{error}</p> : (
                <ul>
                    {studentlist.map((student) => (
                        <li key={student._id}>
                            <strong>{student.name}</strong> - {student.email} - {student.gender}
                            <Link to={`../editstudent/${student._id}`} style={{ marginRight: "10px" }}>✏ Sửa</Link>
                            <button onClick={() => handleDelete(student._id)}>🗑 Xóa</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default StudentList;
