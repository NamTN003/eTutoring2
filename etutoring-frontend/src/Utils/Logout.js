import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const authToken = localStorage.getItem("token");

        if (!authToken) {
            alert("Bạn chưa đăng nhập!");
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
                console.log("✅ Đăng xuất thành công.");
            } else {
                console.error("❌ Lỗi khi đăng xuất:", await response.json());
            }
        } catch (error) {
            console.error("❌ Lỗi kết nối server:", error);
        }

        localStorage.removeItem("authToken");
        alert("Bạn đã đăng xuất thành công!");
        navigate("/login");
    };

    return handleLogout;
};


export default Logout;