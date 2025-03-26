import React, { useEffect, useState } from "react";
import './Imformation.css'; 
const Imformation = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token"); // Lấy token từ localStorage
                if (!token) {
                    console.error("Chưa đăng nhập!");
                    return;
                }

                const decodedToken = JSON.parse(atob(token.split(".")[1])); // Giải mã JWT
                const userId = decodedToken.userId;

                const response = await fetch(`http://localhost:5000/user/${userId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Lỗi khi lấy dữ liệu người dùng");
                }

                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div style={{ maxWidth: "600px", margin: "auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
            <h2>Thông tin tài khoản</h2>
            {userData ? (
                <div>
                    <p><strong>Họ tên:</strong> {userData.name}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Số điện thoại:</strong> {userData.phone || "Chưa cập nhật"}</p>
                    <p><strong>Giới tính:</strong> {userData.gender}</p>
                    <p><strong>Địa chỉ:</strong> {userData.address || "Chưa cập nhật"}</p>
                    <p><strong>Vai trò:</strong> {userData.role}</p>
                </div>
            ) : (
                <p>Đang tải dữ liệu...</p>
            )}
        </div>
    );
};


export default Imformation;