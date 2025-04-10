import React, { useState, useEffect } from "react";
import axios from "axios";
import './Adminreques.css';

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
      <h2>List of upgrade requests</h2>
      {requests.length === 0 ? (
        <p>No requirements</p>
      ) : (
        <table className="requests-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Request status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req._id}>
                <td>{req.name}</td>
                <td>{req.email}</td>
                <td>{req.requestStatus}</td>
                <td>
                  <button onClick={() => handleApprove(req._id)} className="approve-btn">accept</button>
                  <button onClick={() => handleReject(req._id)} className="reject-btn">refuse</button>
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
