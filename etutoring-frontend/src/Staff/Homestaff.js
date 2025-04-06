import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Logout from '../Utils/Logout';
import "./Homestaff.css";
import BlogList from '../compo/BlogList';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faComment, faTableColumns, faUser, faCalendar, faUpload, faImages, faFaceSmileBeam, faHeart } from "@fortawesome/free-solid-svg-icons";

const Homestaff = () => {
    const handleLogout = Logout();
    const [showProfileOptions, setShowProfileOptions] = useState(false);

    return (
        <div className="homestaff-container">
            {/* Sidebar */}
            <div className="homestaff-sidebar">
                <button><b><FontAwesomeIcon icon={faUser} /> Staff</b></button>
                <Link to="/student-management">Student Management</Link>
                <Link to="/rollcall">trạng thái điểm danh</Link>
                <Link to="/meeting">Management Meeting</Link>
                <Link to="/createmeeting">Create Meeting</Link>
                <Link to="/requestupgrade">Request Authorization</Link>
                <Link to="/createsubject">Create Môn</Link>
                <button onClick={handleLogout}><b>Đăng Xuất</b></button>
            </div>
            <BlogList />
        </div>
    );
};

export default Homestaff;