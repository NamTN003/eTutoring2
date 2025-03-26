import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditStudent = () => {
    const { id } = useParams(); // Lấy ID từ URL
    const navigate = useNavigate();
    const [student, setStudent] = useState({ name: "", email: "", phone: "", gender: "", address: "" });


    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/user/${id}`);
                setStudent(response.data);
            } catch (error) {
                console.error("❌ Lỗi khi lấy thông tin nhân viên:", error);
            }
        };
        fetchStaff();
    }, [id]);

    const handleChange = (e) => {
        setStudent({ ...student, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/user/${id}`, student);
            alert("✅ Cập nhật nhân viên thành công!");
            navigate("/studentlist");
        } catch (error) {
            console.error("❌ Lỗi khi cập nhật nhân viên:", error);
            alert("❌ Không thể cập nhật nhân viên");
        }
    };

    return (
        <div style={{ maxWidth: "500px", margin: "auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
            <h2>Chỉnh sửa Sinh Viên</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Họ tên" value={student.name} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={student.email} onChange={handleChange} required />
                <input type="text" name="phone" placeholder="Số điện thoại" value={student.phone} onChange={handleChange} />
                <select name="gender" value={student.gender} onChange={handleChange}>
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                    <option value="Other">Khác</option>
                </select>
                <input type="text" name="address" placeholder="Địa chỉ" value={student.address} onChange={handleChange} />
                <button type="submit">Cập nhật</button>
                <button type="button" onClick={() => navigate("/studentlist")}>Hủy</button>
            </form>
        </div>
    );
};

export default EditStudent;
