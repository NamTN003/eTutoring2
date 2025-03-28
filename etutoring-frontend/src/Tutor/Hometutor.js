import React from 'react';
import Logout from '../Utils/Logout';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { BsPersonCircle } from 'react-icons/bs';
import { FiLogOut, FiMessageSquare, FiCalendar, FiBookOpen, FiEdit, FiBell, FiGrid } from 'react-icons/fi';
import { AiOutlineUpload, AiOutlineHeart } from 'react-icons/ai';
import './Hometutor.css';

const Hometutor = () => {
    const handleLogout = Logout();
    const location = useLocation();
    const isMainDashboard = location.pathname === '/hometutor';

    return (
        <div className="hometutor-container">
            {/* Sidebar */}
            <aside className="hometutor-sidebar">
                <div className="hometutor-sidebar-header">
                    <BsPersonCircle size={32} className="icon tutor-icon" />
                    <span className="tutor-text">Tutor</span>
                </div>
                <nav className="hometutor-nav-links">
                    <Link to="imformation" className="hometutor-nav-item"><FiBookOpen className="icon" /> Thông tin bản thân</Link>
                    <Link to="chattutor" className="hometutor-nav-item"><FiMessageSquare className="icon" /> Nhắn tin</Link>
                    <Link to="meeting" className="hometutor-nav-item"><FiCalendar className="icon" /> Lịch hẹn</Link>
                    <Link to="blog" className="hometutor-nav-item"><FiBookOpen className="icon" /> Blog</Link>
                    <Link to="createblog" className="hometutor-nav-item"><FiEdit className="icon" /> Đăng blog</Link>
                </nav>
                <button onClick={handleLogout} className="hometutor-logout-btn">
                    <FiLogOut className="icon" /> Đăng Xuất
                </button>
            </aside>

            {/* Main Content */}
            <main className="hometutor-main-content">
                <header className="hometutor-header">
                    <h2>Ứng dụng eTutoring - Tutor</h2>
                    <div className="hometutor-header-icons">
                        <Link to="bell"><FiBell className="icon" /></Link>
                        <Link to="grid"><FiGrid className="icon" /></Link>
                        <Link to="chattutor"><FiMessageSquare className="icon" /></Link>
                        <Link to="imformation"><BsPersonCircle className="icon" /></Link>
                    </div>
                </header>
                <div className="hometutor-content-area">
                    {isMainDashboard ? (
                        <section className="hometutor-status-section">
                            <div className="hometutor-status-box">
                                <input type="text" placeholder="Hôm nay bạn thế nào?" className="hometutor-status-input" />
                                <div className="hometutor-upload-options">
                                    <button className="hometutor-upload-btn"><AiOutlineUpload className="icon" /> Tải File</button>
                                    <button className="hometutor-upload-btn"><AiOutlineUpload className="icon" /> Hình Ảnh</button>
                                </div>
                            </div>
                            {[1, 2].map((_, index) => (
                                <div key={index} className="hometutor-status-post">
                                    <BsPersonCircle className="icon profile-icon" />
                                    <div className="hometutor-post-content">
                                        <span>{index === 0
                                            ? "Các cuộc họp định kỳ diễn ra vào tuần thứ 3."
                                            : "Hôm nay là cuộc họp cuối cùng trước kỳ nghỉ."}</span>
                                        <div className="hometutor-comment-section">
                                            <input type="text" placeholder="Thêm bình luận..." className="hometutor-comment-input" />
                                            <AiOutlineHeart className="icon heart-icon" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </section>
                    ) : (
                        <Outlet />
                    )}
                </div>
            </main>
        </div>
    );
};

export default Hometutor;