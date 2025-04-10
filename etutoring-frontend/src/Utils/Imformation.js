import React, { useEffect, useState } from "react";
import './Imformation.css';

const Imformation = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);  // Added loading state
    const [error, setError] = useState(null);      // Added error state

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("User is not logged in!");
                    setError("User is not logged in.");
                    return;
                }

                const decodedToken = JSON.parse(atob(token.split(".")[1]));
                const userId = decodedToken.userId;

                const response = await fetch(`http://localhost:5000/user/${userId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }

                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error(error.message);
                setError("Failed to load user data.");
            } finally {
                setLoading(false); // Stop loading when done
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <div className="loading-message">Loading user data...</div>; // Loading state UI
    }

    if (error) {
        return <div className="error-message">{error}</div>; // Error handling UI
    }

    return (
        <div className="info-container">
            <h2 className="info-title">Account Information</h2>
            <div className="info-content">
                <div className="info-form">
                    <div className="info-row">
                        <div className="info-field">
                            <label>Full Name:</label>
                            <input type="text" value={userData?.name || "Not Provided"} readOnly />
                        </div>
                        <div className="info-field">
                            <label>Email:</label>
                            <input type="text" value={userData?.email || "Not Provided"} readOnly />
                        </div>
                    </div>
                    <div className="info-row">
                        <div className="info-field">
                            <label>Phone Number:</label>
                            <input type="text" value={userData?.phone || "Not Provided"} readOnly />
                        </div>
                        <div className="info-field">
                            <label>Gender:</label>
                            <input type="text" value={userData?.gender || "Not Provided"} readOnly />
                        </div>
                    </div>
                    <div className="info-row">
                        <div className="info-field">
                            <label>Address:</label>
                            <input type="text" value={userData?.address || "Not Provided"} readOnly />
                        </div>
                        <div className="info-field">
                            <label>Role:</label>
                            <input type="text" value={userData?.role || "Not Provided"} readOnly />
                        </div>
                    </div>
                </div>

                <div className="info-avatar">
                    <div className="avatar-img">
                        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="2" />
                            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="white" strokeWidth="2" />
                        </svg>
                    </div>
                    <div className="avatar-name">{userData?.name || "User Name"}</div>
                </div>
            </div>
        </div>
    );
};

export default Imformation;
