import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";
import "./AdminDashborad.css";

const AdminDashboard = () => {
  const [messageData, setMessageData] = useState([["user", "Number of messages"]]);
  const [staffRequestData, setStaffRequestData] = useState([["Day", "Number of requests"]]);
  const [accounts, setAccounts] = useState([
    ["Role", "Total"],
    ["Students", 0],
    ["Tutors", 0],
    ["Staff", 0],
    ["Authorized", 0],
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountRes = await axios.get("http://localhost:5000/dashboard/total-accounts");
        if (accountRes.data) {
          setAccounts([
            ["Role", "Total"],
            ["Students", accountRes.data.students || 0],
            ["Tutors", accountRes.data.tutors || 0],
            ["Staff", accountRes.data.staff || 0],
            ["Authorized", accountRes.data.authorized || 0],
          ]);
        }

        const messageRes = await axios.get("http://localhost:5000/dashboard/message-count");
        const data = [["User", "Number of messages"]];
        messageRes.data.forEach((item) => {
          data.push([item.name, item.messageCount]);
        });
        setMessageData(data);

        const staffReqRes = await axios.get("http://localhost:5000/dashboard/staff-auth-request-count");
        setStaffRequestData(staffReqRes.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p className="dashboard-loading">Loading data...</p>;
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">📊 Admin Dashboard</h2>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3 className="chart-title">User role assignment</h3>
          <Chart
            chartType="PieChart"
            data={accounts}
            options={{
              chartArea: { width: "90%", height: "80%" },
              pieHole: 0.3,
            }}
            width={"100%"}
            height={"300px"}
          />
        </div>

        <div>
          <h3>💬 Number of messages per user</h3>
          <Chart
            chartType="ColumnChart"
            width="100%"
            height="400px"
            data={messageData}
            options={{
              title: "Number of messages sent by each user",
              legend: { position: "none" },
              hAxis: { title: "User" },
              vAxis: { title: "Number of messages" },
              colors: ["#34a853"],
            }}
          />
        </div>

        <div>
          <h3>💬 Number of Staff Authorization Requests</h3>
          <Chart
            chartType="LineChart"
            width="100%"
            height="400px"
            data={staffRequestData}
            options={{
              title: "Number of authorization requests from Staff by day of the month",
              hAxis: { title: "Day" },
              vAxis: { title: "Number of requests" },
              curveType: "function",
              legend: { position: "bottom" },
              colors: ["#f57c00"],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
