import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Logout from '../Utils/Logout';
import { BsPersonCircle } from 'react-icons/bs';
import { FiLogOut, FiMessageSquare, FiBookOpen, FiBell, FiGrid } from 'react-icons/fi';
import { AiOutlineUpload, AiOutlineHeart } from 'react-icons/ai';
import './Homestudent.css';

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
                    <Link to="imformation" className="homestudent-nav-item"><FiBookOpen className="icon" /> Thông tin bản thân</Link>
                    <Link to="chatstudent" className="homestudent-nav-item"><FiMessageSquare className="icon" /> Nhắn tin</Link>
                    <Link to="studentblogs" className="homestudent-nav-item"><FiBookOpen className="icon" /> Blog của sinh viên</Link>
                </nav>
                <button onClick={handleLogout} className="homestudent-logout-btn">
                    <FiLogOut className="icon" /> Đăng Xuất
                </button>
            </aside>

            {/* Main Content */}
            <main className="homestudent-main-content">
                <header className="homestudent-header">
                    <h2>Ứng dụng eTutoring - Student</h2>
                    <div className="homestudent-header-icons">
                        <Link to="bell"><FiBell className="icon" /></Link>
                        <Link to="grid"><FiGrid className="icon" /></Link>
                        <Link to="chatstudent"><FiMessageSquare className="icon" /></Link>
                        <Link to="imformation"><BsPersonCircle className="icon" /></Link>
                    </div>
                </header>
                <div className="homestudent-content-area">
                    {isMainDashboard ? (
                        <section className="homestudent-status-section">
                        <div className="homestudent-status-box">
                            <input type="text" placeholder="Hôm nay bạn thế nào?" className="hometutor-status-input" />
                            <div className="homestudent-upload-options">
                                <button className="homestudent-upload-btn"><AiOutlineUpload className="icon" /> Tải File</button>
                                <button className="homestudent-upload-btn"><AiOutlineUpload className="icon" /> Hình Ảnh</button>
                            </div>
                        </div>
                        {[1, 2].map((_, index) => (
                            <div key={index} className="homestudent-status-post">
                                <BsPersonCircle className="icon profile-icon" />
                                <div className="homestudent-post-content">
                                    <span>{index === 0
                                        ? "Các cuộc họp định kỳ diễn ra vào tuần thứ 3."
                                        : "Hôm nay là cuộc họp cuối cùng trước kỳ nghỉ."}</span>
                                    <div className="homestudent-comment-section">
                                        <input type="text" placeholder="Thêm bình luận..." className="homestudent-comment-input" />
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

export default Homestudent;