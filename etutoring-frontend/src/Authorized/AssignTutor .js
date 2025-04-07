import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AssignTutor.css";

const AssignTutor = () => {
  const [students, setStudents] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [studentRes, tutorRes] = await Promise.all([
          axios.get("http://localhost:5000/user/students-with-tutors", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/user/all-tutors", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setStudents(studentRes.data);
        setTutors(tutorRes.data);
      } catch (error) {
        console.error("❌ Lỗi khi tải dữ liệu:", error);
        setMessage("❌ Không thể tải dữ liệu.");
      }
    };

    fetchData();
  }, []);

  const handleSelectStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

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

      await axios.put(
        "http://localhost:5000/user/assign-tutor",
        {
          studentIds: selectedStudents,
          tutorId: selectedTutor,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("✅ Phân bổ gia sư thành công!");
      setSelectedStudents([]);
      setSelectedTutor("");

      const updated = await axios.get("http://localhost:5000/user/students-with-tutors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(updated.data);
    } catch (error) {
      console.error("❌ Lỗi khi phân bổ gia sư:", error);
      setMessage("❌ Có lỗi xảy ra khi phân bổ. Vui lòng thử lại.");
    }
  };

  return (
    <div className="assign-container">
      <h2>Phân bổ Gia Sư cho Sinh Viên</h2>

      {message && (
        <p className="assign-message" style={{ color: message.includes("✅") ? "green" : "red" }}>
          {message}
        </p>
      )}

      <select
        value={selectedTutor}
        onChange={(e) => setSelectedTutor(e.target.value)}
        required
      >
        <option value="">Chọn Gia Sư</option>
        {tutors.map((tutor) => (
          <option key={tutor._id} value={tutor._id}>
            {tutor.name} - {tutor.email}
          </option>
        ))}
      </select>

            <ul className="assign-student-list">
        {students.map((student) => (
          <li className="student-item" key={student._id}>
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={selectedStudents.includes(student._id)}
                onChange={() => handleSelectStudent(student._id)}
              />
            </div>
            <div className="student-details">
              <div className="name">{student.name}</div>
              <div className="email">{student.email}</div>
              <div className="tutor">
                {student.tutor_id
                  ? `(Gia sư: ${student.tutor_id.name})`
                  : "(Chưa có gia sư)"}
              </div>
            </div>
          </li>
        ))}
      </ul>


      <button
        onClick={handleAssignTutor}
        disabled={!selectedTutor || selectedStudents.length === 0}
      >
        Phân bổ Gia Sư
      </button>
    </div>
  );
};

export default AssignTutor;
