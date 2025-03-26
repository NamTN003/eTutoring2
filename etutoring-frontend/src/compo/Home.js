import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // Import file CSS

const Home = () => {
    return (
        <div className="image-container">
            <div className="overlay"></div>
            <img 
                src="https://offloadmedia.feverup.com/secretldn.com/wp-content/uploads/2022/10/25133932/shutterstock_742274224-2-1024x689.jpg" 
                alt="Background" 
            />
            <div className="content-box">
                <img className="logo" src="https://cdn.haitrieu.com/wp-content/uploads/2022/12/Icon-Truong-Dai-hoc-Greenwich-Viet-Nam.png" alt="Logo" />
                <h2>Academic Portal</h2>
                <p className="subtitle">Đăng nhập để truy cập hệ thống</p>
                <Link to="/login" className="btn primary btn-link">Đăng nhập</Link>

                <p className="footer-text">Powered by Greenwich Việt Nam | CMS</p>
            </div>
        </div>
    );
};

export default Home;
