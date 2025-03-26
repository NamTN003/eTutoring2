import React from 'react';
import { Link } from 'react-router-dom';
import Logout from '../Utils/Logout';
import { FaUsers, FaUserPlus, FaUserShield, FaInfoCircle, FaSignOutAlt } from "react-icons/fa";
import "./Homeadmin.css";

const Homeadmin = () => {
    const handleLogout = Logout();

    return (
        <div className="admin-dashboard">
            {/* Sidebar */}
            <aside className="sidebar">
                <h2 className="logo">eTutoring</h2>
                <nav className="menu">
                    <Link to="/createacount">
                        <FaUserPlus /> Tạo tài khoản cho nhân viên
                    </Link>
                    <Link to="/liststaff">
                        <FaUsers /> Danh sách nhân viên
                    </Link>
                    <Link to="/adminrequests">
                        <FaUserShield /> Danh sách nhân viên muốn lên cấp
                    </Link>
                    <Link to="/imformation">
                        <FaInfoCircle /> Thông tin bản thân
                    </Link>
                </nav>
                <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt /> Đăng Xuất
                </button>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <h1>Welcome to eTutoring</h1>
            </main>
        </div>
    );
};

export default Homeadmin;
