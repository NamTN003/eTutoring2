import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MeetingTutor.css';

const Meetingtutor = () => {
    const [meetings, setMeetings] = useState([]);
    const [error, setError] = useState(null);
    const tutorId = localStorage.getItem("userId");

    useEffect(() => {
        fetchMeetings();
    }, []);

    const fetchMeetings = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_HOST}/meeting?tutorId=${tutorId}`);
            const filteredMeetings = response.data.filter(meeting => meeting.tutor_id?._id === tutorId);
            const sortedMeetings = filteredMeetings.sort((a, b) => new Date(a.meeting_date) - new Date(b.meeting_date));
            setMeetings(sortedMeetings);
        } catch (error) {
            console.error("Error fetching meetings:", error);
            setError("There was an issue fetching your meetings. Please try again later.");
        }
    };

    const formatTime = (time) => {
        const date = new Date(`1970-01-01T${time}:00Z`);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="meeting-container">
            <h2 className="meeting-title">📅 Your Schedule</h2>
            {error && <p className="error-message">{error}</p>}
            {meetings.length > 0 ? (
                <table className="meeting-table">
                    <thead>
                        <tr>
                            <th>📆 Date</th>
                            <th>⏰ Start Time</th>
                            <th>⏰ End Time</th>
                            <th>📚 Subject</th>
                            <th>👩‍🎓 Student</th>
                            <th>📍 Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {meetings.map(meeting => (
                            <tr key={meeting._id}>
                                <td>{new Date(meeting.meeting_date).toLocaleDateString()}</td>
                                <td>{formatTime(meeting.meeting_time)}</td>
                                <td>{formatTime(meeting.end_time)}</td>
                                <td>{meeting.subject_id?.subject_name || "No Subject"}</td>
                                <td>{meeting.student_ids?.map(student => student.name).join(", ") || "No Students"}</td>
                                <td>{meeting.location}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="no-meeting">No meetings scheduled.</p>
            )}
        </div>
    );
};

export default Meetingtutor;
