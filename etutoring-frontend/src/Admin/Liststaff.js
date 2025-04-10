import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Liststaff.css'; 

const Liststaff = () => {
    const [staffList, setStaffList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await axios.get("http://localhost:5000/user/liststaff");
                const staffMembers = response.data.filter(user => user.role === "staff");
                setStaffList(staffMembers);
            } catch (error) {
                console.error(" Error when getting employee list:", error);
            }
        };

        fetchStaff();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            try {
                await axios.delete(`http://localhost:5000/user/${id}`);
                setStaffList(staffList.filter((staff) => staff._id !== id));
                alert("✅ Employee deleted successfully!");
            } catch (error) {
                console.error(" Error while deleting employee:", error);
                alert(" Cannot delete employee");
            }
        }
    };

    return (
        <div className="liststaff-container">
        <h2 className="liststaff-title">List of employees</h2>
        {staffList.length === 0 ? (
            <p className="liststaff-loading-text">⏳ Loading data or no staff available...</p>
        ) : (
            <table className="liststaff-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone number</th>
                        <th>Role</th>
                        <th>Address</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {staffList.map((staff) => (
                        <tr key={staff._id}>
                            <td>{staff.name}</td>
                            <td>{staff.email}</td>
                            <td>{staff.phone}</td>
                            <td>{staff.role}</td>
                            <td>{staff.address}</td>
                            <td>
                                <button 
                                    onClick={() => navigate(`/homeadmin/editstaff/${staff._id}`)} 
                                    className="liststaff-edit-btn"
                                >
                                    ✏ Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(staff._id)} 
                                    className="liststaff-delete-btn"
                                >
                                    🗑 Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
    </div>
    
    );
};

export default Liststaff;
