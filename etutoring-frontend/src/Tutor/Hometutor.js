import React from 'react';
import Logout from '../Utils/Logout';
import { Link } from "react-router-dom";
import BlogList from '../compo/BlogList';

const Hometutor = () => {
    const handleLogout = Logout();

    return (
        <div>
            <h2>Ứng dụng eTutoring</h2>
            <Link to="/imformation">thông tin bản thân</Link>
            <Link to="/chattutor">nhắn tin</Link>
            <Link to="/meeting">lịch hẹn</Link>
            <Link to="/meeting">lịch hẹn của tôi</Link>
            <Link to="/createblog">Đăng blog</Link>
            <Link to="/tutoremail">Email</Link>
            <BlogList />
            <button onClick={handleLogout}>Đăng Xuất</button>
        </div>
    );
};

export default Hometutor;