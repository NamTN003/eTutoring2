import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const RollCall = () => {
    const navigate = useNavigate();
    const [meetings, setMeetings] = useState([]);
    useEffect(() => {
        // 📌 Gọi API để lấy danh sách cuộc họp
        axios.get("http://localhost:5000/meeting")
            .then((response) => {
                setMeetings(response.data);
            })
            .catch((error) => {
                console.error("Lỗi khi lấy danh sách cuộc họp:", error);
            });
    }, []);
    return (
        <div>
            {meetings.map((meeting) => (
                    <button key={meeting._id} onClick={() => navigate(`/updatemeeting/${meeting._id}`)} className="edit-btn">
                        Điểm danh {meeting.name}
                    </button>
                ))}
        </div>
    );
};

export default RollCall;