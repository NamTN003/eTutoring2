import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";
import "./AdminDashborad.css";

const AdminDashboard = () => {
  const [accounts, setAccounts] = useState([
    ["Role", "Total"],
    ["Students", 0],
    ["Tutors", 0],
    ["Staff", 0],
  ]);
  const [logins, setLogins] = useState([
    ["Period", "Logins"],
    ["Today", 0],
    ["This Week", 0],
    ["This Month", 0],
  ]);
  const [totalLogins, setTotalLogins] = useState(0);
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
          ]);
        }

        const loginRes = await axios.get("http://localhost:5000/dashboard/login-stats");

        if (loginRes.data) {
          setLogins([
            ["Period", "Logins"],
            ["Today", loginRes.data.daily || 0],
            ["This Week", loginRes.data.weekly || 0],
            ["This Month", loginRes.data.monthly || 0],
          ]);
        }

        const totalLoginRes = await axios.get("http://localhost:5000/dashboard/total-login-count");

        if (totalLoginRes.data) {
          setTotalLogins(totalLoginRes.data.totalLoginCount || 0);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const adjustedMax = totalLogins > 5 ? totalLogins + 5 : 5;

  if (loading) {
    return <p className="dashboard-loading">Đang tải dữ liệu...</p>;
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">📊 Admin Dashboard</h2>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3 className="chart-title">Phân bố vai trò người dùng</h3>
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

        <div className="dashboard-card">
          <h3 className="chart-title">Lượt đăng nhập theo thời gian</h3>
          <Chart
            chartType="ColumnChart"
            data={logins}
            options={{
              chartArea: { width: "90%", height: "70%" },
              hAxis: { title: "Thời gian" },
              vAxis: { title: "Số lượt", minValue: 0 },
            }}
            width={"100%"}
            height={"300px"}
          />
        </div>
      </div>

      <div className="dashboard-card gauge-card">
        <h3 className="chart-title">Tổng số lượt đăng nhập</h3>
        <Chart
          chartType="Gauge"
          data={[["Label", "Value"], ["Tổng", totalLogins]]}
          options={{
            width: 400,
            height: 120,
            minorTicks: 5,
            max: adjustedMax,
          }}
          width={"100%"}
          height={"200px"}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
