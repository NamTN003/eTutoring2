import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Meeting.css'; // Thêm file CSS riêng

const Meeting = () => {
    const [meetings, setMeetings] = useState([]);

    useEffect(() => {
        fetchMeetings();
    }, []);

    const fetchMeetings = async () => {
        try {
            const response = await axios.get("http://localhost:5000/meeting");
            const sortedMeetings = response.data.sort((a, b) => new Date(a.meeting_date) - new Date(b.meeting_date));
            setMeetings(sortedMeetings);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách cuộc họp:", error);
        }
    };

    const deleteMeeting = async (meetingId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa cuộc họp này?")) return;

        try {
            await axios.delete(`http://localhost:5000/meeting/${meetingId}`);
            setMeetings(meetings.filter(meeting => meeting._id !== meetingId));
            alert("Xóa cuộc họp thành công!");
        } catch (error) {
            console.error("Lỗi khi xóa cuộc họp:", error);
            alert("Không thể xóa cuộc họp. Vui lòng thử lại!");
        }
    };

    return (
        <div className="meeting-container">
            <h2 className="meeting-title">📅 Danh sách cuộc họp</h2>
            <div className="table-wrapper">
                <table className="meeting-table">
                    <thead>
                        <tr>
                            <th>Ngày</th>
                            <th>Giờ bắt đầu</th>
                            <th>Giờ kết thúc</th>
                            <th>Gia sư</th>
                            <th>Học sinh</th>
                            <th>Môn học</th>
                            <th>Địa điểm</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {meetings.map(meeting => (
                            <tr key={meeting._id}>
                                <td>{new Date(meeting.meeting_date).toLocaleDateString()}</td>
                                <td>{meeting.meeting_time}</td>
                                <td>{meeting.end_time}</td>
                                <td>{meeting.tutor_id?.name || "Không có gia sư"}</td>
                                <td>{meeting.student_ids?.map(s => s.name).join(", ") || "Không có học sinh"}</td>
                                <td>{meeting.subject_id?.subject_name || "Không có môn học"}</td>
                                <td>{meeting.location}</td>
                                <td>
                                    <button className="delete-btn" onClick={() => deleteMeeting(meeting._id)}>
                                        ❌ Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {meetings.length === 0 && (
                            <tr>
                                <td colSpan="7" className="no-data">Không có cuộc họp nào.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Meeting;
