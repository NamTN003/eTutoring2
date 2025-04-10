import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RollCallTutor = () => {
    const tutorId = localStorage.getItem("userId");
    const [meetings, setMeetings] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const response = await axios.get('http://localhost:5000/meeting', {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });

                const filteredMeetings = response.data.filter(meeting => meeting.tutor_id?._id === tutorId);
                setMeetings(filteredMeetings);
            } catch (error) {
                console.error("Error fetching meetings:", error);
                setError("There was an issue fetching your meetings. Please try again later.");
            }
        };

        fetchMeetings();
    }, [tutorId]);

    return (
        <div className="rollcall-table-container">
            <h2 className="rollcall-title">Your Class List</h2>
            {error && <p className="error-message">{error}</p>}
            <table className="rollcall-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Location</th>
                        <th>Subject</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {meetings.length > 0 ? (
                        meetings.map(meeting => (
                            <tr key={meeting._id}>
                                <td>{new Date(meeting.meeting_date).toLocaleDateString()}</td>
                                <td>{meeting.meeting_time}</td>
                                <td>{meeting.end_time}</td>
                                <td>{meeting.location}</td>
                                <td>{meeting.subject_id?.subject_name || "No Subject"}</td>
                                <td>
                                    <button
                                        className="rollcall-btn"
                                        onClick={() => navigate(`/hometutor/updatemeeting/${meeting._id}`)}
                                    >
                                        Roll Call
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="no-data">No classes available.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default RollCallTutor;
