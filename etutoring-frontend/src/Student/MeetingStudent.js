import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MeetingStudent.css';

const MeetingStudent = () => {
    const [meetings, setMeetings] = useState([]);
    const studentId = localStorage.getItem("userId");

    useEffect(() => {
        fetchMeetings();
    }, []);

    const fetchMeetings = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_HOST}/meeting?studentId=${studentId}`);
            const filteredMeetings = response.data.filter(meeting =>
                meeting.student_ids?.some(student => student._id === studentId)
            );
            const sortedMeetings = filteredMeetings.sort((a, b) => new Date(a.meeting_date) - new Date(b.meeting_date));
            setMeetings(sortedMeetings);
        } catch (error) {
            console.error("Error fetching meetings:", error);
        }
    };

    const getAttendanceStatus = (meeting) => {
        const record = meeting.attendance?.find(a => a.user_id === studentId || a.user_id?._id === studentId);
        if (!record) return "🕓 Not yet";
        return record.status === "present" ? "✅ Present" : "❌ Absent";
    };

    return (
        <div className="meeting-container">
            <h2 className="meeting-title">📅 Your Schedule</h2>
            {meetings.length > 0 ? (
                <table className="meeting-table">
                    <thead>
                        <tr>
                            <th>📆 Date</th>
                            <th>⏰ Start Time</th>
                            <th>⏰ End Time</th>
                            <th>📚 Subject</th>
                            <th>👨‍🏫 Tutor</th>
                            <th>📍 Location</th>
                            <th>✅ Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {meetings.map(meeting => (
                            <tr key={meeting._id}>
                                <td>{new Date(meeting.meeting_date).toLocaleDateString()}</td>
                                <td>{meeting.meeting_time}</td>
                                <td>{meeting.end_time}</td>
                                <td>{meeting.subject_id?.subject_name || "No subject assigned"}</td>
                                <td>{meeting.tutor_id?.name || "No tutor assigned"}</td>
                                <td>{meeting.location}</td>
                                <td>{getAttendanceStatus(meeting)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="no-meeting">No meetings found.</p>
            )}
        </div>
    );
};

export default MeetingStudent;
