import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Logout from '../Utils/Logout';
import { FaUsers, FaUserPlus, FaUserShield, FaInfoCircle, FaSignOutAlt } from "react-icons/fa";
import BlogList from '../compo/BlogList';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./Homeadmin.css";

const Homeadmin = () => {
    const handleLogout = Logout();
    const location = useLocation();

    const isDefaultPage = location.pathname === "/homeadmin";

    return (
        <div className="admin-dashboard">
            <aside className="sidebar">
                <h2 className="logo">eTutoring</h2>
                <nav className="menu">
                    <Link to="/homeadmin"><i class="fa-solid fa-house"></i>HomePage</Link>
                    <Link to="/homeadmin/createacount"><FaUserPlus /> Tạo tài khoản cho nhân viên</Link>
                    <Link to="/homeadmin/liststaff"><FaUsers /> Danh sách nhân viên</Link>
                    <Link to="/homeadmin/adminrequests"><FaUserShield /> Danh sách nhân viên muốn lên cấp</Link>
                    <Link to="/homeadmin/imformation"><FaInfoCircle /> Thông tin bản thân</Link>
                    <Link to="/homeadmin/admindashboard"><FaInfoCircle /> Dashboard</Link>
                </nav>
                <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt /> Đăng Xuất
                </button>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {isDefaultPage ? (
                    <>
                        <h1>Welcome to eTutoring</h1>
                        <BlogList />
                    </>
                ) : (
                    <Outlet />
                )}
            </main>
        </div>
    );
};

export default Homeadmin;
