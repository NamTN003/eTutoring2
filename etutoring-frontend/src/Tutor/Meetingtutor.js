import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MeetingTutor.css'; // 👉 Import CSS riêng

const MeetingTutor = () => {
    const [meetings, setMeetings] = useState([]);
    const tutorId = localStorage.getItem("userId");

    useEffect(() => {
        fetchMeetings();
    }, []);

    const fetchMeetings = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/meeting?tutorId=${tutorId}`);
            const filteredMeetings = response.data.filter(meeting => meeting.tutor_id?._id === tutorId);
            const sortedMeetings = filteredMeetings.sort((a, b) => new Date(a.meeting_date) - new Date(b.meeting_date));
            setMeetings(sortedMeetings);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách cuộc họp:", error);
        }
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
                            <th>👩‍🎓 Học sinh</th>
                            <th>📍 Địa điểm</th>
                        </tr>
                    </thead>
                    <tbody>
                        {meetings.map(meeting => (
                            <tr key={meeting._id}>
                                <td>{new Date(meeting.meeting_date).toLocaleDateString()}</td>
                                <td>{meeting.meeting_time}</td>
                                <td>{meeting.subject_id?.subject_name || "Không có môn học"}</td>
                                <td>{meeting.student_ids?.map(student => student.name).join(", ") || "Không có học sinh"}</td>
                                <td>{meeting.location}</td>
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

export default MeetingTutor;
