import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MeetingTutor = () => {
    const [meetings, setMeetings] = useState([]);
    const tutorId = localStorage.getItem("userId"); // Lấy tutorId từ localStorage

    useEffect(() => {
        fetchMeetings();
    }, []);

    // 🟢 Lấy danh sách cuộc họp liên quan đến gia sư hiện tại
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
        <div>
            <h2>Danh sách cuộc họp của bạn</h2>
            <ul>
                {meetings.map(meeting => (
                    <li key={meeting._id}>
                        {new Date(meeting.meeting_date).toLocaleDateString()} - {meeting.meeting_time} 
                        (Gia sư: {meeting.tutor_id?.name || "Không có gia sư"} -
                        (Học sinh: {meeting.student_ids?.map(student => student.name).join(", ") || "Không có học sinh"} - 
                        Môn học: {meeting.subject_id?.subject_name || "Không có môn học"} - 
                        Địa điểm: {meeting.location})
                    </li>
                ))}
                {meetings.length === 0 && <p>Không có cuộc họp nào.</p>}
            </ul>
        </div>
    );
};

export default MeetingTutor;