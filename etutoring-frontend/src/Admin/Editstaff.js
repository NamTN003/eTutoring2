import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Editstaff = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        role: "",
        address: "",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/user/${id}`);
                console.log("🔍 Dữ liệu nhân viên:", response.data);
                setFormData(response.data);
            } catch (error) {
                console.error("❌ Lỗi khi lấy thông tin nhân viên:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/user/${id}`, formData);
            alert("✅ Cập nhật nhân viên thành công!");
            navigate("/homeadmin/liststaff");
        } catch (error) {
            console.error("❌ Lỗi khi cập nhật nhân viên:", error);
            alert("❌ Không thể cập nhật nhân viên");
        }
    };

    if (loading) return <p>Đang tải dữ liệu nhân viên...</p>;

    return (
        <div>
            <h2>Chỉnh sửa nhân viên</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Tên nhân viên" required />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Số điện thoại" required />
                <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="Vai trò" required readOnly />
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Địa chỉ" required />
                <button type="submit">💾 Lưu</button>
            </form>
        </div>
    );
};

export default Editstaff;
