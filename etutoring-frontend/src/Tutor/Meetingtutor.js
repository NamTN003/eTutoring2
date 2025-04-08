
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Meeting = () => {
    const [meetings, setMeetings] = useState([]);

    useEffect(() => {
        fetchMeetings();
    }, []);

    // 🟢 Lấy danh sách cuộc họp
    const fetchMeetings = async () => {
        try {
            const response = await axios.get("http://localhost:5000/meeting");
            // Sắp xếp danh sách cuộc họp theo ngày tháng
            const sortedMeetings = response.data.sort((a, b) => new Date(a.meeting_date) - new Date(b.meeting_date));
            setMeetings(sortedMeetings);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách cuộc họp:", error);
        }
    };

    // ❌ Xóa cuộc họp
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
        <div>
            <h2>Danh sách cuộc họp</h2>
            <ul>
                {meetings.map(meeting => (
                    <li key={meeting._id}>
                        {new Date(meeting.meeting_date).toLocaleDateString()} - {meeting.meeting_time} 
                        (Gia sư: {meeting.tutor_id?.name || "Không có gia sư"} - 
                        Học sinh: {meeting.student_ids?.map(student => student.name).join(", ") || "Không có học sinh"} - 
                        Môn học: {meeting.subject_id?.subject_name || "Không có môn học"} - 
                        Địa điểm: {meeting.location})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Meeting;