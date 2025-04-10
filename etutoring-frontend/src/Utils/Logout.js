import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const authToken = localStorage.getItem("token");

        if (!authToken) {
            alert("You are not logged in!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/user/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                }
            });

            if (response.ok) {
                console.log("✅ Logout successful.");
            } else {
                console.error("❌ Error when logging out:", await response.json());
            }
        } catch (error) {
            console.error("❌ Server connection error:", error);
        }

        localStorage.removeItem("authToken");
        alert("You have successfully logged out!");
        navigate("/login");
    };

    return handleLogout;
};


export default Logout;