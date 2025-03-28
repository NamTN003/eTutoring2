import React, { useState } from "react";
import "./RequestUpgrade.css";

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
    <div className="upgrade-container">
      <h2 className="upgrade-title">Gửi yêu cầu nâng cấp</h2>
      <form className="upgrade-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        
        {/* ✅ Nhóm label và textarea nằm ngang */}
        <div className="upgrade-group">
          <label className="upgrade-label">Lý do</label>
          <textarea
            className="upgrade-textarea"
            placeholder="Nhập lý do của bạn..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="upgrade-submit">Gửi yêu cầu</button>
      </form>
    </div>
  );
};

export default RequestUpgrade;
