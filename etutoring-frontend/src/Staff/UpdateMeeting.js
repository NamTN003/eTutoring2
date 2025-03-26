import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const UpdateMeeting = () => {
    const { id } = useParams(); // Lấy meeting_id từ URL
    const [meeting, setMeeting] = useState(null);

    useEffect(() => {
        // 🟢 Fetch chi tiết cuộc họp
        const fetchMeeting = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/meeting/${id}`);
                setMeeting(res.data);
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết cuộc họp:", error);
            }
        };
        fetchMeeting();
    }, [id]);

    // 📝 Cập nhật trạng thái điểm danh
    const updateAttendance = async (studentId, status) => {
        try {
            await axios.put(`http://localhost:5000/meeting/${id}/attendance`, {
                user_id: studentId,
                status: status
            });

            // Cập nhật state ngay lập tức
            setMeeting(prev => ({
                ...prev,
                attendance: prev.attendance.map(a =>
                    a.user_id._id === studentId ? { ...a, status } : a
                )
            }));
            alert("Cập nhật điểm danh thành công!");
        } catch (error) {
            console.error("Lỗi khi cập nhật điểm danh:", error);
        }
    };

    if (!meeting) return <p>Đang tải...</p>;

    return (
        <div>
            <h2>Cập nhật điểm danh</h2>
            <h3>Gia sư: {meeting.tutor_id.name}</h3>
            <h3>Danh sách học sinh:</h3>
            <ul>
                {meeting.student_ids.map(student => {
                    const attendanceStatus = meeting.attendance.find(a => a.user_id.toString() === student._id.toString())?.status || "Not yet";
                    return (
                        <li key={student._id}>
                            {student.name} - Trạng thái: {attendanceStatus}
                            <button onClick={() => updateAttendance(student._id, "present")}>✅ Có mặt</button>
                            <button onClick={() => updateAttendance(student._id, "absent")}>❌ Vắng mặt</button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default UpdateMeeting;
