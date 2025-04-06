import React from 'react';
import { Link } from 'react-router-dom';
import Logout from '../Utils/Logout';
import BlogList from '../compo/BlogList';

const Homeauthorized = () => {
    const handleLogout = Logout();
    return (
        <div>
            <Link to="/createstudent">Tạo tài khoản cho sinh viên</Link><br></br>
            <Link to="/createtutor">Tạo tài khoản cho gia sư</Link><br></br>
            <Link to="/imformation">thông tin bản thân</Link><br></br>
            <Link to="/studentlist">danh sách sinh viên mình tạo</Link><br></br>
            <Link to="/assigntutor">phân bổ gia sư cho sinh viên</Link><br></br>
            <Link to="/sendemail">Send Email</Link><br></br>
            <BlogList />
            tôi là nhân viên ủy ủy quyền
            <button onClick={handleLogout}>Đăng xuất</button>
        </div>
    );
};

export default Homeauthorized;