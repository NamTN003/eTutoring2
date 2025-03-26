import React, { useState, useEffect } from "react";
import axios from "axios";

const AssignTutor = () => {
    const [students, setStudents] = useState([]);
    const [tutors, setTutors] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectedTutor, setSelectedTutor] = useState("");
    const [message, setMessage] = useState("");

    // 📌 Lấy danh sách sinh viên & gia sư khi load trang
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const studentRes = await axios.get("http://localhost:5000/user/students-with-tutors", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const tutorRes = await axios.get("http://localhost:5000/user/all-tutors", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStudents(studentRes.data);
                setTutors(tutorRes.data);
            } catch (error) {
                console.error("❌ Lỗi khi tải dữ liệu:", error);
            }
        };
        fetchData();
    }, []);

    // 📌 Xử lý chọn/deselect sinh viên
    const handleSelectStudent = (id) => {
        setSelectedStudents((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        );
    };

    // 📌 Gửi yêu cầu phân bổ gia sư
    const handleAssignTutor = async () => {
        if (!selectedTutor || selectedStudents.length === 0) {
            setMessage("⚠️ Vui lòng chọn gia sư và ít nhất một sinh viên.");
            return;
        }
        if (selectedStudents.length > 10) {
            setMessage("⚠️ Bạn chỉ có thể phân bổ tối đa 10 sinh viên cùng lúc.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.put("http://localhost:5000/user/assign-tutor", {
                studentIds: selectedStudents,
                tutorId: selectedTutor
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage("✅ Phân bổ gia sư thành công!");
            setSelectedStudents([]);
            setSelectedTutor("");

            // Cập nhật lại danh sách sinh viên sau khi phân bổ
            const updatedStudents = await axios.get("http://localhost:5000/user/students-with-tutors", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(updatedStudents.data);
        } catch (error) {
            console.error("❌ Lỗi khi phân bổ gia sư:", error);
            setMessage("❌ Lỗi khi phân bổ gia sư. Hãy thử lại.");
        }
    };

    return (
        <div style={{ maxWidth: "800px", margin: "auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
            <h2>Phân bổ Gia Sư cho Sinh Viên</h2>

            {message && <p style={{ color: message.includes("✅") ? "green" : "red" }}>{message}</p>}

            {/* 📌 Chọn gia sư */}
            <select value={selectedTutor} onChange={(e) => setSelectedTutor(e.target.value)} required>
                <option value="">Chọn Gia Sư</option>
                {tutors.map((tutor) => (
                    <option key={tutor._id} value={tutor._id}>
                        {tutor.name} - {tutor.email}
                    </option>
                ))}
            </select>

            {/* 📌 Danh sách sinh viên */}
            <ul style={{ listStyle: "none", padding: 0 }}>
                {students.map((student) => (
                    <li key={student._id} style={{ marginBottom: "5px" }}>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedStudents.includes(student._id)}
                                onChange={() => handleSelectStudent(student._id)}
                            />
                            <strong> {student.name}</strong> - {student.email}  
                            {student.tutor_id ? ` (Gia sư: ${student.tutor_id.name})` : " (Chưa có gia sư)"}
                        </label>
                    </li>
                ))}
            </ul>

            <button onClick={handleAssignTutor} disabled={!selectedTutor || selectedStudents.length === 0}>
                Phân bổ Gia Sư
            </button>
        </div>
    );
};

export default AssignTutor;
