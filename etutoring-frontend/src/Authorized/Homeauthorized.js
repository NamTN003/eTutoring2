import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Logout from '../Utils/Logout';
import {
    FiUserPlus, FiUsers, FiKey, FiBell, FiGrid, FiLogOut
} from 'react-icons/fi';
import { BsPersonCircle } from 'react-icons/bs';
import { AiOutlineUpload, AiOutlineHeart } from 'react-icons/ai';
import './Homeauthorized.css';

const Homeauthorized = () => {
    const handleLogout = Logout();
    const location = useLocation();
    const isMainDashboard = location.pathname === '/homeauthorized';

    return (
        <div className="homeauthorized-container">
            <aside className="homeauthorized-sidebar">
                <div className="homeauthorized-sidebar-header">
                    <BsPersonCircle size={32} className="icon authorized-icon" />
                    <span className="authorized-text">Authorized</span>
                </div>
                <nav className="homeauthorized-nav-links">
                    <Link to="createstudent" className="homeauthorized-nav-item"><FiUserPlus className="icon" /> Tạo tài khoản sinh viên</Link>
                    <Link to="createtutor" className="homeauthorized-nav-item"><FiUserPlus className="icon" /> Tạo tài khoản gia sư</Link>
                    <Link to="imformation" className="homeauthorized-nav-item"><FiKey className="icon" /> Thông tin bản thân</Link>
                    <Link to="studentlist" className="homeauthorized-nav-item"><FiUsers className="icon" /> Danh sách sinh viên</Link>
                    <Link to="assigntutor" className="homeauthorized-nav-item"><FiKey className="icon" /> Phân bổ gia sư</Link>
                </nav>
                <button onClick={handleLogout} className="homeauthorized-logout-btn">
                    <FiLogOut className="icon" /> Đăng Xuất
                </button>
            </aside>

            <main className="homeauthorized-main-content">
                <header className="homeauthorized-header">
                    <h2>Ứng dụng eTutoring - Authorized Staff</h2>
                    <div className="homeauthorized-header-icons">
                        <Link to="bell"><FiBell className="icon" /></Link>
                        <Link to="grid"><FiGrid className="icon" /></Link>
                        <Link to="imformation"><BsPersonCircle className="icon" /></Link>
                    </div>
                </header>

                <div className="homeauthorized-content-area">
                    {isMainDashboard ? (
                        <section className="homeauthorized-status-section">
                            <div className="homeauthorized-status-box">
                                <input type="text" placeholder="Bạn muốn chia sẻ gì?" className="homeauthorized-status-input" />
                                <div className="homeauthorized-upload-options">
                                    <button className="homeauthorized-upload-btn"><AiOutlineUpload className="icon" /> Tải File</button>
                                    <button className="homeauthorized-upload-btn"><AiOutlineUpload className="icon" /> Hình Ảnh</button>
                                </div>
                            </div>
                            {[1, 2].map((_, index) => (
                                <div key={index} className="homeauthorized-status-post">
                                    <BsPersonCircle className="icon profile-icon" />
                                    <div className="homeauthorized-post-content">
                                        <span>{index === 0
                                            ? "Hôm nay bạn đã phân bổ đủ gia sư chưa?"
                                            : "Hãy cập nhật danh sách sinh viên mới."}</span>
                                        <div className="homeauthorized-comment-section">
                                            <input type="text" placeholder="Thêm bình luận..." className="homeauthorized-comment-input" />
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

export default Homeauthorized;