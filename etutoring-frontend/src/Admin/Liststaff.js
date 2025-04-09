import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Liststaff.css'; 

const Liststaff = () => {
    const [staffList, setStaffList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await axios.get("http://localhost:5000/user"); // 🔗 API lấy danh sách user
                const staffMembers = response.data.filter(user => user.role === "staff"); // 🏷 Lọc chỉ lấy nhân viên
                setStaffList(staffMembers);
            } catch (error) {
                console.error("❌ Lỗi khi lấy danh sách nhân viên:", error);
            }
        };

        fetchStaff();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
            try {
                await axios.delete(`http://localhost:5000/user/${id}`);
                setStaffList(staffList.filter((staff) => staff._id !== id));
                alert("✅ Xóa nhân viên thành công!");
            } catch (error) {
                console.error("❌ Lỗi khi xóa nhân viên:", error);
                alert("❌ Không thể xóa nhân viên");
            }
        }
    };

    return (
        <div className="liststaff-container">
        <h2 className="liststaff-title">Danh sách nhân viên</h2>
        {staffList.length === 0 ? (
            <p className="liststaff-loading-text">⏳ Đang tải dữ liệu hoặc không có nhân viên nào...</p>
        ) : (
            <table className="liststaff-table">
                <thead>
                    <tr>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Vai trò</th>
                        <th>Địa chỉ</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {staffList.map((staff) => (
                        <tr key={staff._id}>
                            <td>{staff.name}</td>
                            <td>{staff.email}</td>
                            <td>{staff.phone}</td>
                            <td>{staff.role}</td>
                            <td>{staff.address}</td>
                            <td>
                                <button 
                                    onClick={() => navigate(`/homeadmin/editstaff/${staff._id}`)} 
                                    className="liststaff-edit-btn"
                                >
                                    ✏ Sửa
                                </button>
                                <button 
                                    onClick={() => handleDelete(staff._id)} 
                                    className="liststaff-delete-btn"
                                >
                                    🗑 Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
    </div>
    
    );
};

export default Liststaff;
