import React, { useState } from 'react';
import axios from 'axios';
import './CreateSubject.css';

const CreateSubject = () => {
    const [form, setForm] = useState({
        subject_code: "",
        subject_name: "",
        description: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/subject", form, {
                headers: { "Content-Type": "application/json" }
            });
            alert("✅ Môn học đã được tạo thành công!");
            setForm({
                subject_code: "",
                subject_name: "",
                description: ""
            });
        } catch (error) {
            console.error("❌ Lỗi khi tạo môn học:", error.response ? error.response.data : error);
            alert("Đã xảy ra lỗi!");
        }
    };

    return (
        <div className="subject-container">
            <h2 className="subject-title">📘 Tạo Môn Học Mới</h2>
            <form className="subject-form" onSubmit={handleSubmit}>
                <div className="subject-group">
                    <label>Mã môn học</label>
                    <input
                        type="text"
                        name="subject_code"
                        value={form.subject_code}
                        onChange={handleChange}
                        placeholder="VD: MTH001"
                        required
                    />
                </div>
                <div className="subject-group">
                    <label>Tên môn học</label>
                    <input
                        type="text"
                        name="subject_name"
                        value={form.subject_name}
                        onChange={handleChange}
                        placeholder="VD: Toán học"
                        required
                    />
                </div>
                <div className="subject-group">
                    <label>Mô tả</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Nhập mô tả về môn học..."
                        rows="4"
                    />
                </div>
                <button type="submit" className="subject-submit">➕ Tạo Môn Học</button>
            </form>
        </div>
    );
};

export default CreateSubject;
