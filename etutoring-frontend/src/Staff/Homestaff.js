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
            <aside className="homestaff-sidebar">
            <div className="sidebar-logo">
            <img
            src="https://www.unialliance.ac.uk/wp-content/uploads/2023/08/Greenwich-LOGO_2022-N-01.png"
            alt="Greenwich Logo"
            className="sidebar-logo-img"
            />
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

            <main className="homestaff-main-content">
                <header className="homestaff-header">
                    <h2>eTutoring – Staff </h2>
                    <div className="homestaff-header-icons">
                        <Link to="#"><FiGrid className="icon" /></Link>
                        <Link to="imformation">< BsPersonCircle className="icon" /></Link>
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