import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Editstaff = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        role: "",
        address: "",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/user/${id}`);
                console.log("🔍 Dữ liệu nhân viên:", response.data);
                setFormData(response.data);
            } catch (error) {
                console.error("❌ Lỗi khi lấy thông tin nhân viên:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/user/${id}`, formData);
            alert("✅ Employee update successful!");
            navigate("/homeadmin/liststaff");
        } catch (error) {
            console.error("❌ Error while updating employee:", error);
            alert("❌ Unable to update employee");
        }
    };

    if (loading) return <p>Loading employee data...</p>;

    return (
        <div>
            <h2>Edit staff</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Employee Name" required />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone number" required />
                <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="Role" required readOnly />
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" required />
                <button type="submit">💾 Save</button>
            </form>
        </div>
    );
};

export default Editstaff;
