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
            const response = await axios.get("http://localhost:5000/meeting");
            setMeetings(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách cuộc họp:", error);
        }
    };

    const deleteMeeting = async (meetingId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa cuộc họp này?")) return;

        try {
            await axios.delete(`http://localhost:5000/meeting/${meetingId}`);
            setMeetings(meetings.filter(meeting => meeting._id !== meetingId));
            alert("✅ Xóa cuộc họp thành công!");
        } catch (error) {
            console.error("Lỗi khi xóa cuộc họp:", error);
            alert("❌ Không thể xóa cuộc họp. Vui lòng thử lại!");
        }
    };

    return (
        <div className="meeting-table-container">
            <h2 className="meeting-table-title">📋 Danh sách cuộc họp</h2>
            <div className="table-wrapper">
                <table className="meeting-table">
                    <thead>
                        <tr>
                            <th>📅 Ngày họp</th>
                            <th>🕒 Giờ</th>
                            <th>📍 Địa điểm</th>
                            <th>👨‍🏫 Gia sư</th>
                            <th>👨‍🎓 Học sinh</th>
                            <th>❌</th>
                        </tr>
                    </thead>
                    <tbody>
                        {meetings.map(meeting => (
                            <tr key={meeting._id}>
                                <td>{new Date(meeting.meeting_date).toLocaleDateString()}</td>
                                <td>{meeting.meeting_time}</td>
                                <td>{meeting.location}</td>
                                <td>{meeting.tutor_id?.name || "Chưa rõ"}</td>
                                <td>{meeting.student_ids?.map(s => s.name).join(', ') || "Không có"}</td>
                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={() => deleteMeeting(meeting._id)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Meeting;
