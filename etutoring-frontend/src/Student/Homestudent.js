import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Logout from '../Utils/Logout';
import BlogList from '../compo/BlogList';
import {
    FiBell, FiGrid, FiLogOut, FiMail
} from 'react-icons/fi';
import { BsPersonCircle } from 'react-icons/bs';
import './Homestudent.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Homestudent = () => {
    const handleLogout = Logout();
    const location = useLocation();
    const isMainDashboard = location.pathname === '/homestudent';

    return (
        <div className="homestudent-container">
            {/* Sidebar */}
            <aside className="homestudent-sidebar">
                <div className="homestudent-sidebar-header">
                    <BsPersonCircle size={32} className="icon student-icon" />
                    <span className="student-text">Student</span>
                </div>
                <nav className="homestudent-nav-links">
                    <Link to="/homestudent" className="homestudent-nav-item"><i className="fa-solid fa-house"></i> Homepage</Link>
                    <Link to="imformation" className="homestudent-nav-item"><i className="fa-solid fa-user"></i> Thông tin bản thân</Link>
                    <Link to="chatstudent" className="homestudent-nav-item"><i className="fa-solid fa-comments"></i> Nhắn tin</Link>
                    <Link to="meetingstudent" className="homestudent-nav-item"><FiGrid className="icon" /> Lịch học</Link>
                    <Link to="studentemail" className="homestudent-nav-item"><FiMail className="icon" /> Email</Link>
                </nav>
                <button onClick={handleLogout} className="homestudent-logout-btn">
                    <FiLogOut className="icon" /> Đăng Xuất
                </button>
            </aside>

            {/* Main Content */}
            <main className="homestudent-main-content">
                <header className="homestudent-header">
                    <h2>eTutoring – Student</h2>
                    <div className="homestudent-header-icons">
                        <Link to="#"><FiBell className="icon" /></Link>
                        <Link to="#"><FiGrid className="icon" /></Link>
                        <Link to="imformation"><BsPersonCircle className="icon" /></Link>
                    </div>
                </header>

                <div className="homestudent-content-area">
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

export default Homestudent;
