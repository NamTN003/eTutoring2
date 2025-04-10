import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Logout from '../Utils/Logout';
import { FaUsers, FaUserPlus, FaUserShield, FaInfoCircle, FaSignOutAlt } from "react-icons/fa";
import BlogList from '../compo/BlogList';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./Homeadmin.css";

const Homeadmin = () => {
    const handleLogout = Logout();
    const location = useLocation();

    const isDefaultPage = location.pathname === "/homeadmin";

    return (
        <div className="admin-dashboard">
            <aside className="sidebar">
                <h2 className="logo">eTutoring</h2>
                <nav className="menu">
                    <Link to="/homeadmin"><i class="fa-solid fa-house"></i>HomePage</Link>
                    <Link to="/homeadmin/imformation"><FaInfoCircle /> Personal information</Link>
                    <Link to="/homeadmin/createacount"><FaUserPlus /> Create account for employees</Link>
                    <Link to="/homeadmin/liststaff"><FaUsers /> List employees</Link>
                    <Link to="/homeadmin/adminrequests"><FaUserShield /> List employees promoted</Link>
                    <Link to="/homeadmin/admindashboard"><FaInfoCircle /> Dashboard</Link>
                </nav>
                <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt /> Log Out
                </button>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {isDefaultPage ? (
                    <>
                        <h1>Welcome to eTutoring</h1>
                        <BlogList />
                    </>
                ) : (
                    <Outlet />
                )}
            </main>
        </div>
    );
};

export default Homeadmin;
