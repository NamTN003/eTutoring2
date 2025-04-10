import React, { useState } from "react";
import "./RequestUpgrade.css";

const RequestUpgrade = () => {
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
    const authToken = localStorage.getItem("token");
    if (!authToken) return alert("You are not logged in!");

    const res = await fetch(`${process.env.REACT_APP_SERVER_HOST}/user/request-authorization`, {
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
      <h2 className="upgrade-title">Submit Permission Request</h2>
      <form className="upgrade-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div className="upgrade-group">
          <label className="upgrade-label">Reason</label>
          <textarea
            className="upgrade-textarea"
            placeholder="Enter your reason..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="upgrade-submit">Submit Request</button>
      </form>
    </div>
  );
};

export default RequestUpgrade;
