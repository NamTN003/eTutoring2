import React, { useState, useEffect } from "react";
import axios from "axios";
import './Adminreques.css';  // Importing the CSS file for styling

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const res = await axios.get("http://localhost:5000/user/");
      setRequests(res.data);
    };

    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    await axios.put(`http://localhost:5000/user/approve/${id}`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setRequests(requests.filter(req => req._id !== id));
  };

  const handleReject = async (id) => {
    await axios.put(`http://localhost:5000/user/reject/${id}`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setRequests(requests.filter(req => req._id !== id));
  };

  return (
    <div className="admin-requests-container">
      <h2>Danh sách yêu cầu nâng cấp</h2>
      {requests.length === 0 ? (
        <p>Không có yêu cầu nào</p>
      ) : (
        <table className="requests-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>Trạng thái yêu cầu</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req._id}>
                <td>{req.name}</td>
                <td>{req.email}</td>
                <td>{req.requestStatus}</td>
                <td>
                  <button onClick={() => handleApprove(req._id)} className="approve-btn">Duyệt</button>
                  <button onClick={() => handleReject(req._id)} className="reject-btn">Từ chối</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminRequests;
