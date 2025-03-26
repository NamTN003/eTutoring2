import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Logout from '../Utils/Logout';
import "./Homestaff.css";
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

            {/* Main Content */}
            <div className="homestaff-main-content">
                {/* Header */}
                <div className="homestaff-header">
                    <div className="homestaff-header-left">
                        <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/12/Icon-Truong-Dai-hoc-Greenwich-Viet-Nam.png" alt="Logo" className="homestaff-logo" />
                    </div>
                    <div className="homestaff-header-right">
                        <button className="homestaff-action-btn"><FontAwesomeIcon icon={faBell} /></button>
                        <button className="homestaff-action-btn"><FontAwesomeIcon icon={faComment} /></button>
                        <button className="homestaff-action-btn"><FontAwesomeIcon icon={faTableColumns} /></button>
                        <button className="homestaff-action-btn" onClick={() => setShowProfileOptions(!showProfileOptions)}>
                            <FontAwesomeIcon icon={faUser} />
                        </button>
                        <button className="homestaff-action-btn"><FontAwesomeIcon icon={faCalendar} /></button>

                        {/* Profile Dropdown */}
                        {showProfileOptions && (
                            <div className="homestaff-profile-dropdown">
                                <Link to="/profile">Xem thông tin</Link>
                                <button onClick={handleLogout}>Đăng Xuất</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Upload Section */}
                <div className="homestaff-upload-section">
                    <h3>User, how are you today?</h3>
                    <input type="text" placeholder="Type here..." />
                    <div className="homestaff-media-options">
                        <button>Upload File <FontAwesomeIcon icon={faUpload} /></button>
                        <button>Pic/Vid <FontAwesomeIcon icon={faImages} /></button>
                        <button>Emotion <FontAwesomeIcon icon={faFaceSmileBeam} /></button>
                    </div>
                </div>

                {/* New Information Section */}
                <div className="homestaff-new-information">
                    <div className="homestaff-message">
                        <span>Regular meetings are held every 3rd week and will be held online or offline depending on the situation.</span>
                        <button className="homestaff-like-btn"><FontAwesomeIcon icon={faHeart} /> Like</button>
                        <input type="text" placeholder="Your thoughts, please add comment..." />
                    </div>
                    <div className="homestaff-message">
                        <span>Today is the last meeting and we will have a holiday break.</span>
                        <button className="homestaff-like-btn"><FontAwesomeIcon icon={faHeart} /> Like</button>
                        <input type="text" placeholder="Your thoughts, please add comment..." />
                    </div>
                </div>
            </div>

            {/* Right Sidebar (Chat Box) */}
            <div className="homestaff-chat-box-section">
                <div className="homestaff-search-bar">
                    <input type="text" placeholder="Search for messages on the web..." />
                </div>
                <div className="homestaff-chat-box">
                    <h2>Chat section</h2>
                    <ul>
                        <li>
                            <span className="homestaff-username">User 1</span>
                            <div className="homestaff-chat-bubble homestaff-user-1">
                                <p>This is a message from User 1.</p>
                            </div>
                            <span className="homestaff-message-time">10:15 AM</span>
                        </li>
                        <li>
                            <span className="homestaff-username">User 2</span>
                            <div className="homestaff-chat-bubble homestaff-user-2">
                                <p>This is a message from User 2.</p>
                            </div>
                            <span className="homestaff-message-time">10:20 AM</span>
                        </li>
                        <li>
                            <span className="homestaff-username">User 3</span>
                            <div className="homestaff-chat-bubble homestaff-user-3">
                                <p>This is a message from User 3.</p>
                            </div>
                            <span className="homestaff-message-time">10:25 AM</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Homestaff;
