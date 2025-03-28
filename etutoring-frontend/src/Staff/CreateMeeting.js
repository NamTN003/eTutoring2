import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreateMeeting.css'; // ✅ Import CSS đã đặt tên riêng

const CreateMeeting = () => {
    const userId = localStorage.getItem("userId");

    const [form, setForm] = useState({
        meeting_date: "",
        meeting_time: "",
        tutor_id: "",
        student_ids: [],
        subject_id: "",
        location: "",
        created_by: userId,
    });

    const [tutors, setTutors] = useState([]);
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tutorRes, studentRes, subjectRes] = await Promise.all([
                    axios.get("http://localhost:5000/user/role?tutors=true"),
                    axios.get("http://localhost:5000/user/role?students=true"),
                    axios.get("http://localhost:5000/subject")
                ]);
                setTutors(tutorRes.data);
                setStudents(studentRes.data);
                setSubjects(subjectRes.data);
            } catch (error) {
                console.error("❌ Lỗi khi tải dữ liệu:", error.response ? error.response.data : error);
            }
        };
        fetchData();
    }, []);

    const handleTutorChange = (e) => {
        const tutorId = e.target.value;
        const tutorStudents = students.filter(student => student.tutor_id === tutorId);
        setFilteredStudents(tutorStudents);
        setForm(prev => ({
            ...prev,
            tutor_id: tutorId,
            student_ids: tutorStudents.map(student => student._id)
        }));
    };

    const handleStudentSelect = (studentId) => {
        setForm(prev => {
            const isSelected = prev.student_ids.includes(studentId);
            return {
                ...prev,
                student_ids: isSelected
                    ? prev.student_ids.filter(id => id !== studentId)
                    : [...prev.student_ids, studentId]
            };
        });
    };

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/meeting/create", form, {
                headers: { "Content-Type": "application/json" }
            });
            alert(res.data.message);
        } catch (error) {
            console.error("❌ Lỗi khi tạo cuộc họp:", error.response ? error.response.data : error);
        }
    };

    return (
        <div className="createmeeting-container">
            <h2 className="createmeeting-title">Tạo cuộc họp mới</h2>
            <form className="createmeeting-form" onSubmit={handleSubmit}>
                <div className="createmeeting-group">
                    <label>Ngày họp</label>
                    <input 
                        type="date" 
                        name="meeting_date" 
                        value={form.meeting_date} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="createmeeting-group">
                    <label>Giờ họp</label>
                    <input 
                        type="time" 
                        name="meeting_time" 
                        value={form.meeting_time} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="createmeeting-group">
                    <label>Gia sư</label>
                    <select name="tutor_id" value={form.tutor_id} onChange={handleTutorChange} required>
                        <option value="">Chọn gia sư</option>
                        {tutors.map(tutor => (
                            <option key={tutor._id} value={tutor._id}>{tutor.name}</option>
                        ))}
                    </select>
                </div>

                <div className="createmeeting-group">
                    <label>Môn học</label>
                    <select name="subject_id" value={form.subject_id} onChange={handleChange} required>
                        <option value="">Chọn môn học</option>
                        {subjects.map(subject => (
                            <option key={subject._id} value={subject._id}>{subject.subject_name}</option>
                        ))}
                    </select>
                </div>

                <div className="createmeeting-group">
                    <label>Danh sách học sinh</label>
                    <div className="createmeeting-students">
                        {filteredStudents.length === 0 ? (
                            <p>Không có học sinh nào</p>
                        ) : (
                            filteredStudents.map(student => (
                                <div key={student._id} className="createmeeting-student">
                                    <input
                                        type="checkbox"
                                        checked={form.student_ids.includes(student._id)}
                                        onChange={() => handleStudentSelect(student._id)}
                                    />
                                    {student.name}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="createmeeting-group">
                    <label>Địa điểm</label>
                    <input 
                        type="text" 
                        name="location" 
                        value={form.location} 
                        onChange={handleChange} 
                        placeholder="Nhập địa điểm" 
                        required 
                    />
                </div>

                <input type="hidden" name="created_by" value={userId} />

                <button type="submit" className="createmeeting-submit">Tạo cuộc họp</button>
            </form>
        </div>
    );
};

export default CreateMeeting;
