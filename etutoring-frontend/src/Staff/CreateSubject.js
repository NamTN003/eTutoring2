import React, { useState } from 'react';
import axios from 'axios';

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
            const res = await axios.post("http://localhost:5000/subject", form, {
                headers: { "Content-Type": "application/json" }
            });
            alert("Môn học đã được tạo thành công!");
            setForm({
                subject_code: "",
                subject_name: "",
                description: ""
            });
        } catch (error) {
            console.error("Lỗi khi tạo môn học:", error.response ? error.response.data : error);
            alert("Lỗi khi tạo môn học!");
        }
    };

    return (
        <div>
            <h2>Tạo môn học mới</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Mã môn học:</label>
                    <input
                        type="text"
                        name="subject_code"
                        value={form.subject_code}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Tên môn học:</label>
                    <input
                        type="text"
                        name="subject_name"
                        value={form.subject_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Mô tả:</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Tạo môn học</button>
            </form>
        </div>
    );
};

export default CreateSubject;