import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./UpdateMeeting.css";

const UpdateMeeting = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_SERVER_HOST}/meeting/${id}`);
        setMeeting(res.data);
      } catch (error) {
        console.error("Error fetching meeting details:", error);
      }
    };
    fetchMeeting();
  }, [id]);

  const updateAttendance = async (studentId, status) => {
    try {
      await axios.put(`${process.env.REACT_APP_SERVER_HOST}/meeting/${id}/attendance`, {
        user_id: studentId,
        status: status
      });

      const res = await axios.get(`${process.env.REACT_APP_SERVER_HOST}/meeting/${id}`);
      setMeeting(res.data);

      alert("✅ Attendance updated successfully!");
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  if (!meeting) return <p>Loading...</p>;

  return (
    <div className="attendance-wrapper">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <h2>📋 Update Attendance</h2>
      <h3>👨‍🏫 Tutor: {meeting.tutor_id.name}</h3>

      <table className="attendance-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Student Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {meeting.student_ids.map((student, index) => {
            const attendanceStatus =
              meeting.attendance.find(a => a.user_id.toString() === student._id.toString())?.status || "Not yet";
            return (
              <tr key={student._id}>
                <td>{index + 1}</td>
                <td>{student.name}</td>
                <td>
                  <span className={`status-tag ${attendanceStatus}`}>
                    {attendanceStatus === "present" ? "✅ Present" :
                      attendanceStatus === "absent" ? "❌ Absent" : "🕓 Not Yet"}
                  </span>
                </td>
                <td>
                  <button className="present-btn" onClick={() => updateAttendance(student._id, "present")}>Present</button>
                  <button className="absent-btn" onClick={() => updateAttendance(student._id, "absent")}>Absent</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UpdateMeeting;
