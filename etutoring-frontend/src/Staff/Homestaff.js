import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Logout from '../Utils/Logout';
import BlogList from '../compo/BlogList';
import {
    FiUserPlus, FiUsers, FiKey, FiBell, FiGrid, FiLogOut
} from 'react-icons/fi';
import { BsPersonCircle } from 'react-icons/bs';
import './Homestaff.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Homestaff = () => {
    const handleLogout = Logout();
    const location = useLocation();
    const isMainDashboard = location.pathname === '/homestaff';

    return (
        <div className="homestaff-container">
            {/* Sidebar */}
            <aside className="homestaff-sidebar">
                <div className="homestaff-sidebar-header">
                    <BsPersonCircle size={32} className="icon staff-icon" />
                    <span className="staff-text">Staff</span>
                </div>
                <nav className="homestaff-nav-links">
                    <Link to="/homestaff" className="homestaff-nav-item"><i className="fa-solid fa-house"></i> Homepage</Link>
                    <Link to="imformation" className="homestaff-nav-item"><FiUsers className="icon" /> Thông tin bản thân</Link>
                    <Link to="rollcall" className="homestaff-nav-item"><FiKey className="icon" /> Trạng thái điểm danh</Link>
                    <Link to="meeting" className="homestaff-nav-item"><FiGrid className="icon" /> Quản lý cuộc họp</Link>
                    <Link to="createmeeting" className="homestaff-nav-item"><FiUserPlus className="icon" /> Tạo cuộc họp</Link>
                    <Link to="requestupgrade" className="homestaff-nav-item"><FiKey className="icon" /> Yêu cầu phân quyền</Link>
                    <Link to="createsubject" className="homestaff-nav-item"><FiGrid className="icon" /> Tạo môn học</Link>
                </nav>
                <button onClick={handleLogout} className="homestaff-logout-btn">
                    <FiLogOut className="icon" /> Đăng Xuất
                </button>
            </aside>

            {/* Main Content */}
            <main className="homestaff-main-content">
                <header className="homestaff-header">
                    <h2>eTutoring – Staff </h2>
                    <div className="homestaff-header-icons">
                        <Link to="#"><FiBell className="icon" /></Link>
                        <Link to="#"><FiGrid className="icon" /></Link>
                        <Link to="imformation"><BsPersonCircle className="icon" /></Link>
                    </div>
                </header>

                <div className="homestaff-content-area">
                    {isMainDashboard ? (
                        <div className="bloglist-wrapper">
                            <BlogList />
                        </div>
                    ) : (
                        <Outlet />
                    )}
                </div>
            </main>
        </div>
    );
};

export default Homestaff;