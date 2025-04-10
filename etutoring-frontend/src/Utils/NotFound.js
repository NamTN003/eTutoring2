import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <h1>404 - Page Not Found</h1>
            <p>The path you are trying to access does not exist..</p>
            <Link to="/" style={{ color: "#007BFF", textDecoration: "none", fontWeight: "bold" }}>
            Back to home page
            </Link>
        </div>
    );
};


export default NotFound;