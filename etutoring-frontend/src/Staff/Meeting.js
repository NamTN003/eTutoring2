import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Meeting.css';

const Meeting = () => {
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_HOST}/meeting`);
      const sortedMeetings = response.data.sort((a, b) => new Date(a.meeting_date) - new Date(b.meeting_date));
      setMeetings(sortedMeetings);
    } catch (error) {
      console.error("Error fetching meeting list:", error);
    }
  };

  const deleteMeeting = async (meetingId) => {
    if (!window.confirm("Are you sure you want to delete this meeting?")) return;

    try {
      await axios.delete(`${process.env.REACT_APP_SERVER_HOST}/meeting/${meetingId}`);
      setMeetings(meetings.filter(meeting => meeting._id !== meetingId));
      alert("Meeting deleted successfully!");
    } catch (error) {
      console.error("Error deleting meeting:", error);
      alert("Unable to delete meeting. Please try again.");
    }
  };

  return (
    <div className="meeting-container">
      <h2 className="meeting-title">📅 Meeting List</h2>
      <div className="table-wrapper">
        <table className="meeting-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Tutor</th>
              <th>Students</th>
              <th>Subject</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {meetings.map(meeting => (
              <tr key={meeting._id}>
                <td>{new Date(meeting.meeting_date).toLocaleDateString()}</td>
                <td>{meeting.meeting_time}</td>
                <td>{meeting.end_time}</td>
                <td>{meeting.tutor_id?.name || "No tutor assigned"}</td>
                <td>{meeting.student_ids?.map(s => s.name).join(", ") || "No students assigned"}</td>
                <td>{meeting.subject_id?.subject_name || "No subject assigned"}</td>
                <td>{meeting.location}</td>
                <td>
                  <button className="delete-btn" onClick={() => deleteMeeting(meeting._id)}>
                    ❌ Delete
                  </button>
                </td>
              </tr>
            ))}
            {meetings.length === 0 && (
              <tr>
                <td colSpan="8" className="no-data">No meetings available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Meeting;
