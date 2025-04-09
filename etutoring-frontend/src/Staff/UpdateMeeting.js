import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // ✅ thêm useNavigate
import "./UpdateMeeting.css";

const UpdateMeeting = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // ✅ hook điều hướng
    const [meeting, setMeeting] = useState(null);

    useEffect(() => {
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

    const updateAttendance = async (studentId, status) => {
        try {
            await axios.put(`http://localhost:5000/meeting/${id}/attendance`, {
                user_id: studentId,
                status: status
            });

            setMeeting(prev => ({
                ...prev,
                attendance: prev.attendance.map(a =>
                    a.user_id._id === studentId ? { ...a, status } : a
                )
            }));
            alert("✅ Cập nhật điểm danh thành công!");
        } catch (error) {
            console.error("Lỗi khi cập nhật điểm danh:", error);
        }
    };

    if (!meeting) return <p>Đang tải...</p>;

    return (
        <div className="attendance-wrapper">
            {/* ✅ Nút quay lại */}
            <button className="back-btn" onClick={() => navigate(-1)}>← Quay lại</button>

            <h2>📋 Cập nhật điểm danh</h2>
            <h3>👨‍🏫 Gia sư: {meeting.tutor_id.name}</h3>

            <table className="attendance-table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên học sinh</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {meeting.student_ids.map((student, index) => {
                        const attendanceStatus =
                            meeting.attendance.find(a => a.user_id.toString() === student._id.toString())?.status || "Not yet";
                        return (
                            <tr key={student._id}>
                                <td>{index + 1}</td>
                                <td>{student.name}</td>
                                <td>
                                    <span className={`status-tag ${attendanceStatus}`}>
                                        {attendanceStatus === "present" ? "✅ Có mặt" :
                                            attendanceStatus === "absent" ? "❌ Vắng mặt" : "🕓 Chưa điểm danh"}
                                    </span>
                                </td>
                                <td>
                                    <button className="present-btn" onClick={() => updateAttendance(student._id, "present")}>Có mặt</button>
                                    <button className="absent-btn" onClick={() => updateAttendance(student._id, "absent")}>Vắng mặt</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default UpdateMeeting;
