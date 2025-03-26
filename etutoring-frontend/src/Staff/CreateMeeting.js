import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateMeeting = () => {
    const userId = localStorage.getItem("userId");

    const [form, setForm] = useState({
        meeting_date: "",
        meeting_time: "",
        tutor_id: "",
        student_ids: [],
        subject_id: "", // Thêm subject_id
        location: "",
        created_by: userId,
    });

    const [tutors, setTutors] = useState([]);
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]); // Thêm subjects
    const [filteredStudents, setFilteredStudents] = useState([]);

    // 📌 Fetch danh sách Tutors, Students
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tutorRes, studentRes, subjectRes] = await Promise.all([
                    axios.get("http://localhost:5000/user/role?tutors=true"),
                    axios.get("http://localhost:5000/user/role?students=true"),
                    // axios.get("http://localhost:5000/meeting"), // Lấy danh sách subjects
                    axios.get("http://localhost:5000/subject") // Lấy danh sách subjects
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

    // 📌 Chọn gia sư => Cập nhật danh sách học sinh thuộc gia sư đó
    const handleTutorChange = (e) => {
        const tutorId = e.target.value;

        // Lọc danh sách học sinh theo tutor_id
        const tutorStudents = students.filter(student => student.tutor_id === tutorId);

        setFilteredStudents(tutorStudents);
        setForm(prev => ({
            ...prev,
            tutor_id: tutorId,
            student_ids: tutorStudents.map(student => student._id) // Chọn tất cả học sinh
        }));
    };

    // 📌 Chọn/bỏ chọn từng học sinh
    const handleStudentSelect = (studentId) => {
        setForm(prev => {
            const isSelected = prev.student_ids.includes(studentId);
            return {
                ...prev,
                student_ids: isSelected
                    ? prev.student_ids.filter(id => id !== studentId) // Bỏ chọn
                    : [...prev.student_ids, studentId] // Thêm vào danh sách
            };
        });
    };

    // 📌 Xử lý nhập liệu trong form
    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // 📌 Gửi dữ liệu lên server
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("📤 Dữ liệu gửi lên:", form);

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

                {/* Chọn gia sư */}
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
