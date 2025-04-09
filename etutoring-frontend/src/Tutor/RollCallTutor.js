import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RollCallTutor = () => {
    const tutorId = localStorage.getItem("userId"); // Lấy ID của Tutor từ localStorage
    const [meetings, setMeetings] = useState([]);

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/meeting`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });

                // Lọc các cuộc họp mà Tutor hiện tại phụ trách
                const filteredMeetings = response.data.filter(meeting => meeting.tutor_id?._id === tutorId);
                setMeetings(filteredMeetings);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách cuộc họp:", error);
            }
        };

        fetchMeetings();
    }, [tutorId]);

    return (
        <div className="rollcall-table-container">
            <h2 className="rollcall-title">Danh sách lớp học của bạn</h2>
            <table className="rollcall-table">
                <thead>
                    <tr>
                        <th>Ngày</th>
                        <th>Giờ</th>
                        <th>Địa điểm</th>
                        <th>Môn học</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {meetings.map(meeting => (
                        <tr key={meeting._id}>
                            <td>{new Date(meeting.meeting_date).toLocaleDateString()}</td>
                            <td>{meeting.meeting_time}</td>
                            <td>{meeting.location}</td>
                            <td>{meeting.subject_id?.subject_name || "Không có môn học"}</td>
                            <td>
                                <button
                                    className="rollcall-btn"
                                    onClick={() => window.location.href = `/hometutor/updatemeeting/${meeting._id}`}
                                >
                                    Điểm danh
                                </button>
                            </td>
                        </tr>
                    ))}
                    {meetings.length === 0 && (
                        <tr>
                            <td colSpan="5" className="no-data">Không có lớp học nào.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default RollCallTutor;