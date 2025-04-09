import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Logout from '../Utils/Logout';
import BlogList from '../compo/BlogList';
import {
    FiUserPlus, FiUsers, FiKey, FiBell, FiGrid, FiLogOut, FiMail
} from 'react-icons/fi';
import { BsPersonCircle } from 'react-icons/bs';
import { AiOutlineUpload, AiOutlineHeart } from 'react-icons/ai';
import './Homeauthorized.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Homeauthorized = () => {
    const handleLogout = Logout();
    const location = useLocation();
    const isMainDashboard = location.pathname === '/homeauthorized';

    return (
        <div className="homeauthorized-container">
            {/* Sidebar */}
            <aside className="homeauthorized-sidebar">
            <div className="sidebar-logo">
            <img
            src="https://www.unialliance.ac.uk/wp-content/uploads/2023/08/Greenwich-LOGO_2022-N-01.png"
            alt="Greenwich Logo"
            className="sidebar-logo-img"
            />
            </div>
                <nav className="homeauthorized-nav-links"> 
                    <Link to="/homeauthorized" className="homeauthorized-nav-item"><i class="fa-solid fa-house"></i> Homepage</Link>
                    <Link to="imformation" className="homeauthorized-nav-item"><FiKey className="icon" /> Thông tin bản thân</Link>
                    <Link to="createstudent" className="homeauthorized-nav-item"><FiUserPlus className="icon" /> Tạo tài khoản sinh viên</Link>
                    <Link to="createtutor" className="homeauthorized-nav-item"><FiUserPlus className="icon" /> Tạo tài khoản gia sư</Link>
                    <Link to="listtutor" className="homeauthorized-nav-item"><FiUsers className="icon" /> Danh sách Gia Sư</Link>
                    <Link to="studentlist" className="homeauthorized-nav-item"><FiUsers className="icon" /> Danh sách sinh viên</Link>
                    <Link to="assigntutor" className="homeauthorized-nav-item"><FiKey className="icon" /> Phân bổ gia sư</Link>
                    <Link to="sendemail" className="homeauthorized-nav-item"><FiMail className="icon" /> Gửi Email</Link>
                </nav>
                <button onClick={handleLogout} className="homeauthorized-logout-btn">
                    <FiLogOut className="icon" /> Đăng Xuất
                </button>
            </aside>

            {/* Main Content */}
            <main className="homeauthorized-main-content">
                <header className="homeauthorized-header">
                    <h2>  eTutoring – Authorized </h2>
                    <div className="homeauthorized-header-icons">
                        <Link to="#"><FiGrid className="icon" /></Link>
                        <Link to="imformation"><BsPersonCircle className="icon" /></Link>
                    </div>
                </header>

                <div className="homeauthorized-content-area">
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

export default Homeauthorized;

