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
            const response = await axios.get(`http://localhost:5000/meeting?studentId=${studentId}`);
            const filteredMeetings = response.data.filter(meeting =>
                meeting.student_ids?.some(student => student._id === studentId)
            );
            const sortedMeetings = filteredMeetings.sort((a, b) => new Date(a.meeting_date) - new Date(b.meeting_date));
            setMeetings(sortedMeetings);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách cuộc họp:", error);
        }
    };

    const getAttendanceStatus = (meeting) => {
        const record = meeting.attendance?.find(a => a.user_id === studentId || a.user_id?._id === studentId);
        if (!record) return "🕓 Chưa điểm danh";
        return record.status === "present" ? "✅ Có mặt" : "❌ Vắng mặt";
    };

    return (
        <div className="meeting-container">
            <h2 className="meeting-title">📅 Lịch học của bạn</h2>
            {meetings.length > 0 ? (
                <table className="meeting-table">
                    <thead>
                        <tr>
                            <th>📆 Ngày</th>
                            <th>⏰ Giờ</th>
                            <th>📚 Môn học</th>
                            <th>👨‍🏫 Gia sư</th>
                            <th>📍 Địa điểm</th>
                            <th>✅ Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {meetings.map(meeting => (
                            <tr key={meeting._id}>
                                <td>{new Date(meeting.meeting_date).toLocaleDateString()}</td>
                                <td>{meeting.meeting_time}</td>
                                <td>{meeting.subject_id?.subject_name || "Không có môn học"}</td>
                                <td>{meeting.tutor_id?.name || "Không có gia sư"}</td>
                                <td>{meeting.location}</td>
                                <td>{getAttendanceStatus(meeting)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="no-meeting">Không có cuộc họp nào.</p>
            )}
        </div>
    );
};

export default MeetingStudent;
