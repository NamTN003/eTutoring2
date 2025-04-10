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
          axios.get(`${process.env.REACT_APP_SERVER_HOST}/user/students-with-tutors`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_SERVER_HOST}/user/all-tutors`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setStudents(studentRes.data);
        setTutors(tutorRes.data);
      } catch (error) {
        console.error("❌ Error loading data:", error);
        setMessage("❌ Failed to load data.");
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
      setMessage("⚠️ Please select a tutor and at least one student.");
      return;
    }

    if (selectedStudents.length > 10) {
      setMessage("⚠️ You can assign up to 10 students at a time.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${process.env.REACT_APP_SERVER_HOST}/user/assign-tutor`,
        {
          studentIds: selectedStudents,
          tutorId: selectedTutor,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("✅ Tutor assigned successfully!");
      setSelectedStudents([]);
      setSelectedTutor("");

      const updated = await axios.get(`${process.env.REACT_APP_SERVER_HOST}/user/students-with-tutors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(updated.data);
    } catch (error) {
      console.error("❌ Error assigning tutor:", error);
      setMessage("❌ An error occurred during assignment. Please try again.");
    }
  };

  return (
    <div className="assign-container">
      <h2>Assign Tutor to Students</h2>

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
        <option value="">Select Tutor</option>
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
                  ? `(Tutor: ${student.tutor_id.name})`
                  : "(No tutor assigned)"}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <button
        onClick={handleAssignTutor}
        disabled={!selectedTutor || selectedStudents.length === 0}
      >
        Assign Tutor
      </button>
    </div>
  );
};

export default AssignTutor;
