import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Logout from '../Utils/Logout';
import {
    FiCalendar, FiClock, FiFileText, FiKey, FiBell, FiGrid, FiLogOut
} from 'react-icons/fi';
import { AiOutlineUpload, AiOutlineHeart } from 'react-icons/ai';
import { BsPersonCircle } from 'react-icons/bs';
import './Homestaff.css';

const Homestaff = () => {
    const handleLogout = Logout();
    const location = useLocation();

    // Kiểm tra nếu đang ở đúng "/homestaff"
    const isMainDashboard = location.pathname === '/homestaff';

    return (
        <div className="homestaff-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <BsPersonCircle size={32} className="icon staff-icon" />
                    <span className="staff-text">Staff</span>
                </div>
                <nav className="nav-links">
                    <Link to="rollcall" className="nav-item"><FiClock className="icon" /> Trạng thái điểm danh</Link>
                    <Link to="meeting" className="nav-item"><FiCalendar className="icon" /> Management Meeting</Link>
                    <Link to="createmeeting" className="nav-item"><FiFileText className="icon" /> Create Meeting</Link>
                    <Link to="createsubject" className="nav-item"><FiFileText className="icon" /> Create subject</Link>
                    <Link to="requestupgrade" className="nav-item"><FiKey className="icon" /> Request Authorization</Link>
                </nav>
                <button onClick={handleLogout} className="logout-btn">
                    <FiLogOut className="icon" /> Đăng Xuất
                </button>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">
                <header className="header">
                    <h2>Ứng dụng eTutoring - Staff</h2>
                    <div className="header-icons">
                        <Link to="/bell" className="action-btn profile-btn"><FiBell className="icon" /></Link>
                        <Link to="/ring" className="action-btn profile-btn"><FiGrid className="icon" /></Link>
                        <Link to="imformation" className="action-btn profile-btn"><BsPersonCircle className="icon" /></Link>
                    </div>
                </header>

                {/* Luôn render Outlet */}
                <div className="homestaff-content-area">
                    {isMainDashboard ? (
                        <section className="status-section">
                            <div className="status-box">
                                <input type="text" placeholder="Hôm nay bạn thế nào?" className="status-input" />
                                <div className="upload-options">
                                    <button className="upload-btn"><AiOutlineUpload className="icon" /> Tải File</button>
                                    <button className="upload-btn"><AiOutlineUpload className="icon" /> Hình Ảnh</button>
                                </div>
                            </div>
                            {[1, 2].map((_, index) => (
                                <div key={index} className="status-post">
                                    <BsPersonCircle className="icon profile-icon" />
                                    <div className="post-content">
                                        <span>{index === 0
                                            ? "Các cuộc họp định kỳ diễn ra vào tuần thứ 3."
                                            : "Hôm nay là cuộc họp cuối cùng trước kỳ nghỉ."}</span>
                                        <div className="comment-section">
                                            <input type="text" placeholder="Thêm bình luận..." className="comment-input" />
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

export default Homestaff;
