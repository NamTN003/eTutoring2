import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreateMeeting.css';

const CreateMeeting = () => {
  const userId = localStorage.getItem("userId");

  const [form, setForm] = useState({
    meeting_date: "",
    meeting_time: "",
    end_time: "",
    tutor_id: "",
    student_ids: [],
    subject_id: "",
    location: "",
    created_by: userId,
  });

  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tutorRes, studentRes, subjectRes] = await Promise.all([
          axios.get("http://localhost:5000/user/role?tutors=true"),
          axios.get("http://localhost:5000/user/role?students=true"),
          axios.get("http://localhost:5000/subject")
        ]);
        setTutors(tutorRes.data);
        setStudents(studentRes.data);
        setSubjects(subjectRes.data);
      } catch (error) {
        console.error("❌ Error fetching data:", error.response ? error.response.data : error);
      }
    };
    fetchData();
  }, []);

  const handleTutorChange = (e) => {
    const tutorId = e.target.value;
    const tutorStudents = students.filter(student => student.tutor_id === tutorId);
    setFilteredStudents(tutorStudents);
    setForm(prev => ({
      ...prev,
      tutor_id: tutorId,
      student_ids: tutorStudents.map(student => student._id)
    }));
  };

  const handleStudentSelect = (studentId) => {
    setForm(prev => {
      const isSelected = prev.student_ids.includes(studentId);
      return {
        ...prev,
        student_ids: isSelected
          ? prev.student_ids.filter(id => id !== studentId)
          : [...prev.student_ids, studentId]
      };
    });
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📤 Submitting meeting data:", form);

    try {
      const res = await axios.post("http://localhost:5000/meeting/create", form, {
        headers: { "Content-Type": "application/json" },
      });
      alert(res.data.message);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Unexpected error!";
      if (errorMessage.includes("45 phút")) {
        alert("Cannot create meeting! The new meeting must start at least 45 minutes after the previous one ends.");
      } else {
        alert(errorMessage);
      }
    }
  };

  return (
    <div className="createmeeting-container">
      <h2 className="createmeeting-title">Create New Meeting</h2>
      <form onSubmit={handleSubmit} className="createmeeting-form">
        <div className="createmeeting-group">
          <label htmlFor="meeting_date">Meeting Date</label>
          <input
            type="date"
            id="meeting_date"
            name="meeting_date"
            value={form.meeting_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="createmeeting-group">
          <label htmlFor="meeting_time">Start Time</label>
          <input
            type="time"
            id="meeting_time"
            name="meeting_time"
            value={form.meeting_time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="createmeeting-group">
          <label htmlFor="end_time">End Time</label>
          <input
            type="time"
            id="end_time"
            name="end_time"
            value={form.end_time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="createmeeting-group">
          <label htmlFor="tutor_id">Select Tutor</label>
          <select name="tutor_id" value={form.tutor_id} onChange={handleTutorChange} required>
            <option value="">Select Tutor</option>
            {tutors.map(tutor => (
              <option key={tutor._id} value={tutor._id}>{tutor.name}</option>
            ))}
          </select>
        </div>

        <div className="createmeeting-group">
          <label htmlFor="subject_id">Select Subject</label>
          <select name="subject_id" value={form.subject_id} onChange={handleChange} required>
            <option value="">Select Subject</option>
            {subjects.map(subject => (
              <option key={subject._id} value={subject._id}>{subject.subject_name}</option>
            ))}
          </select>
        </div>

        <div className="createmeeting-students-box">
          <strong>Select Students:</strong>
          <div className="createmeeting-students">
            {filteredStudents.length === 0 ? (
              <p>No students available</p>
            ) : (
              filteredStudents.map(student => (
                <div key={student._id} className="createmeeting-student">
                  <input
                    type="checkbox"
                    checked={form.student_ids.includes(student._id)}
                    onChange={() => handleStudentSelect(student._id)}
                  />
                  {student.name}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="createmeeting-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            name="location"
            id="location"
            placeholder="Enter location"
            value={form.location}
            onChange={handleChange}
            required
          />
        </div>

        <input type="hidden" name="created_by" value={userId} />

        <button type="submit" className="createmeeting-submit">Create Meeting</button>
      </form>
    </div>
  );
};

export default CreateMeeting;
