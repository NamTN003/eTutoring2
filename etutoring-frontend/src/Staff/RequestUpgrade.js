import React from 'react';
import { useState } from "react";


const RequestUpgrade = () => {
    const [reason, setReason] = useState("");

    const handleSubmit = async () => {
      const authToken = localStorage.getItem("token");
      if (!authToken) return alert("Bạn chưa đăng nhập!");
  
      const res = await fetch("http://localhost:5000/user/request-authorization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ reason }),
      });
  
      const data = await res.json();
      alert(data.message);
    };
  
    return (
      <div>
        <h2>Gửi yêu cầu nâng cấp</h2>
        <textarea
          placeholder="Nhập lý do của bạn..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <button onClick={handleSubmit}>Gửi yêu cầu</button>
      </div>
    );
  };
  

export default RequestUpgrade;