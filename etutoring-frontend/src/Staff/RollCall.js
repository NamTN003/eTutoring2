import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './RollCall.css';

const RollCall = () => {
    const navigate = useNavigate();
    const [meetings, setMeetings] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER_HOST}/meeting`)
            .then((res) => {
                setMeetings(res.data);
            })
            .catch((error) => {
                console.error("Error fetching meetings list:", error);
            });
    }, []);

    return (
        <div className="rollcall-table-container">
            <h2 className="rollcall-title">Meeting List</h2>
            <table className="rollcall-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Location</th>
                        <th>Tutor</th>
                        <th>Subject</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {meetings.map(meeting => (
                        <tr key={meeting._id}>
                            <td>{new Date(meeting.meeting_date).toLocaleDateString()}</td>
                            <td>{meeting.meeting_time}</td>
                            <td>{meeting.end_time || "Not available"}</td>
                            <td>{meeting.location}</td>
                            <td>{meeting.tutor_id?.name || "No tutor assigned"}</td>
                            <td>{meeting.subject_id?.subject_name || "No subject assigned"}</td>
                            <td>
                                <button
                                    className="rollcall-btn"
                                    onClick={() => navigate(`/homestaff/updatemeeting/${meeting._id}`)}
                                >
                                    Roll Call
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RollCall;
