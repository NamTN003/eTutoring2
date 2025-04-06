import React from 'react';
import Logout from '../Utils/Logout';
import { Link } from "react-router-dom";
import BlogList from '../compo/BlogList';

const Homestudent = () => {

    const handleLogout = Logout();

    return (
        <div>
            
            <h2>Ứng dụng eTutoring</h2>
            <Link to="/imformation">thông tin bản thân</Link>
            <Link to="/chatstudent">nhắn tin</Link>
            <Link to="/meeting">lịch hẹn</Link>
            <Link to="/studentemail">Email</Link>
            <BlogList />
            <button onClick={handleLogout}>Đăng Xuất</button>
        </div>
    );
};

export default Homestudent;