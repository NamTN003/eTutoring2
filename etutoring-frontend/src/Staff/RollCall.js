import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './RollCall.css';

const RollCall = () => {
    const navigate = useNavigate();
    const [meetings, setMeetings] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/meeting")
            .then((res) => {
                setMeetings(res.data);
            })
            .catch((error) => {
                console.error("Lỗi khi lấy danh sách cuộc họp:", error);
            });
    }, []);

    return (
        <div className="rollcall-table-container">
            <h2 className="rollcall-title">Danh sách cuộc họp</h2>
            <table className="rollcall-table">
                <thead>
                    <tr>
                        <th>Ngày</th>
                        <th>Giờ</th>
                        <th>Địa điểm</th>
                        <th>Gia sư</th>
                        <th>Môn học</th> {/* Thêm cột Môn học */}
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {meetings.map(meeting => (
                        <tr key={meeting._id}>
                            <td>{new Date(meeting.meeting_date).toLocaleDateString()}</td>
                            <td>{meeting.meeting_time}</td>
                            <td>{meeting.location}</td>
                            <td>{meeting.tutor_id?.name || "Không có gia sư"}</td>
                            <td>{meeting.subject_id?.subject_name || "Không có môn học"}</td> {/* Hiển thị tên môn học */}
                            <td>
                                <button
                                    className="rollcall-btn"
                                    onClick={() => navigate(`/homestaff/updatemeeting/${meeting._id}`)}
                                >
                                    Điểm danh
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