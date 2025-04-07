import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Editstudent.css";

const EditStudent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState({
        name: "",
        email: "",
        phone: "",
        gender: "",
        address: ""
    });

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/user/${id}`);
                setStudent(response.data);
            } catch (error) {
                console.error("❌ Lỗi khi lấy thông tin sinh viên:", error);
            }
        };
        fetchStudent();
    }, [id]);

    const handleChange = (e) => {
        setStudent({ ...student, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/user/${id}`, student);
            alert("✅ Cập nhật sinh viên thành công!");
            navigate("/homeauthorized/studentlist");
        } catch (error) {
            console.error("❌ Lỗi khi cập nhật sinh viên:", error);
            alert("❌ Không thể cập nhật sinh viên");
        }
    };

    return (
        <div className="editstudent-container">
            <h2>Chỉnh sửa Sinh Viên</h2>
            <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="name"
                placeholder="Họ tên"
                value={student.name}
                onChange={handleChange}
                required
                maxLength={30}
                pattern="^[^\d]+$"
                title="Họ tên không được chứa số và tối đa 30 ký tự"
                />
           <input
                type="email"
                name="email"
                placeholder="Email"
                value={student.email}
                onChange={handleChange}
                required
                maxLength={25}
                pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$"
                title="Email phải có đuôi @gmail.com và tối đa 25 ký tự"
                />
            <input
                type="text"
                name="phone"
                placeholder="Số điện thoại"
                value={student.phone}
                onChange={handleChange}
                maxLength={15}
                pattern="^\d{0,15}$"
                title="Chỉ được nhập số, tối đa 15 chữ số"
                />
                <select name="gender" value={student.gender} onChange={handleChange}>
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                    <option value="Other">Khác</option>
                </select>
                <input
                    type="text"
                    name="address"
                    placeholder="Địa chỉ"
                    value={student.address}
                    onChange={handleChange}
                />
                <button type="submit">Cập nhật</button>
                <button type="button" onClick={() => navigate("/homeauthorized/studentlist")}>Hủy</button>
            </form>
        </div>
    );
};

export default EditStudent;
