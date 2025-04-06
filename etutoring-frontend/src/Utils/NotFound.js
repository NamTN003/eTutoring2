import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <h1>404 - Không tìm thấy trang</h1>
            <p>Đường dẫn bạn truy cập không tồn tại.</p>
            <Link to="/" style={{ color: "#007BFF", textDecoration: "none", fontWeight: "bold" }}>
                Quay về trang chủ
            </Link>
        </div>
    );
};


export default NotFound;