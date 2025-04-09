import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateMeeting = () => {
    const userId = localStorage.getItem("userId");

    const [form, setForm] = useState({
        meeting_date: "",
        meeting_time: "",
        end_time: "",
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
        console.log("📤 Dữ liệu gửi lên:", form);

        try {
            const res = await axios.post("http://localhost:5000/meeting/create", form, {
                headers: { "Content-Type": "application/json" },
            });
            alert(res.data.message);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Lỗi không xác định!";
            if (errorMessage.includes("45 phút")) {
                alert("Không thể tạo cuộc họp! Cuộc họp mới phải cách giờ kết thúc của cuộc họp trước ít nhất 45 phút."); // Thông báo lỗi
            } else {
                alert(errorMessage);
            }
        }
    };

    return (
        <div>
            <h2>Tạo cuộc họp mới</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="date" 
                    name="meeting_date" 
                    value={form.meeting_date} 
                    onChange={handleChange} 
                    required 
                />

                <input 
                    type="time" 
                    name="meeting_time" 
                    value={form.meeting_time} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="time" 
                    name="end_time" 
                    value={form.end_time} 
                    onChange={handleChange} 
                    required 
                />

                <select name="tutor_id" value={form.tutor_id} onChange={handleTutorChange} required>
                    <option value="">Chọn gia sư</option>
                    {tutors.map(tutor => (
                        <option key={tutor._id} value={tutor._id}>{tutor.name}</option>
                    ))}
                </select>

                <select name="subject_id" value={form.subject_id} onChange={handleChange} required>
                    <option value="">Chọn môn học</option>
                    {subjects.map(subject => (
                        <option key={subject._id} value={subject._id}>{subject.subject_name}</option>
                    ))}
                </select>

                <div>
                    <h4>Học sinh đã chọn:</h4>
                    {filteredStudents.length === 0 ? (
                        <p>Không có học sinh nào</p>
                    ) : (
                        filteredStudents.map(student => (
                            <div key={student._id}>
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

                <input 
                    type="text" 
                    name="location" 
                    placeholder="Địa điểm" 
                    value={form.location} 
                    onChange={handleChange} 
                    required 
                />

                <input type="hidden" name="created_by" value={userId} />
                
                <button type="submit">Tạo cuộc họp</button>
            </form>
        </div>
    );
};


export default CreateMeeting;
