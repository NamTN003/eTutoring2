import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Logout from '../Utils/Logout';
import BlogList from '../compo/BlogList';
import {
    FiGrid, FiLogOut, FiMail, FiEdit3, FiBell
} from 'react-icons/fi';
import { BsPersonCircle } from 'react-icons/bs';
import './Hometutor.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Hometutor = () => {
    const handleLogout = Logout();
    const location = useLocation();
    const isMainDashboard = location.pathname === '/hometutor';

    return (
        <div className="hometutor-container">
            <aside className="hometutor-sidebar">
            <div className="sidebar-logo">
            <img
            src="https://www.unialliance.ac.uk/wp-content/uploads/2023/08/Greenwich-LOGO_2022-N-01.png"
            alt="Greenwich Logo"
            className="sidebar-logo-img"
            />
            </div>
                <nav className="hometutor-nav-links">
                    <Link to="/hometutor" className="hometutor-nav-item"><i className="fa-solid fa-house"></i> Homepage</Link>
                    <Link to="imformation" className="hometutor-nav-item"><i className="fa-solid fa-user"></i> Thông tin bản thân</Link>
                    <Link to="chattutor" className="hometutor-nav-item"><i className="fa-solid fa-comments"></i> Nhắn tin</Link>
                    <Link to="meetingtutor" className="hometutor-nav-item"><FiGrid className="icon" /> Lịch học</Link>
                    <Link to="createblog" className="hometutor-nav-item"><FiEdit3 className="icon" /> Đăng blog</Link>
                    <Link to="tutoremail" className="hometutor-nav-item"><FiMail className="icon" /> Email</Link>
                    <Link to="rollcalltutor" className="hometutor-nav-item"><i className="fa-solid fa-user-check"></i> Điểm danh</Link>
                </nav>
                <button onClick={handleLogout} className="hometutor-logout-btn">
                    <FiLogOut className="icon" /> Đăng Xuất
                </button>
            </aside>


            <main className="hometutor-main-content">
                <header className="hometutor-header">
                    <h2>eTutoring – Tutor</h2>
                    <div className="hometutor-header-icons">
                        <Link to="#"><FiGrid className="icon" /></Link>
                        <Link to="imformation"><BsPersonCircle className="icon" /></Link>
                    </div>
                </header>

                <div className="hometutor-content-area">
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

export default Hometutor;