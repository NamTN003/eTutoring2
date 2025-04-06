import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";

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
        // Gọi API tổng số tài khoản
        const accountRes = await axios.get("http://localhost:5000/dashboard/total-accounts");

        if (accountRes.data) {
          setAccounts([
            ["Role", "Total"],
            ["Students", accountRes.data.students || 0],
            ["Tutors", accountRes.data.tutors || 0],
            ["Staff", accountRes.data.staff || 0],
          ]);
        }

        // Gọi API thống kê lượt đăng nhập
        const loginRes = await axios.get("http://localhost:5000/dashboard/login-stats");

        if (loginRes.data) {
          setLogins([
            ["Period", "Logins"],
            ["Today", loginRes.data.daily || 0],
            ["This Week", loginRes.data.weekly || 0],
            ["This Month", loginRes.data.monthly || 0],
          ]);
        }

        // Gọi API tổng số lượt đăng nhập
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

  if (loading) {
    return <p>Loading data...</p>;
  }

  const adjustedMax = totalLogins > 5 ? totalLogins + 5 : 5;

  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      {/* Biểu đồ Tổng số tài khoản */}
      <Chart
        chartType="PieChart"
        data={accounts}
        options={{
          title: "User Roles Distribution",
          chartArea: { width: "80%", height: "80%" },
          pieHole: 0.3,
        }}
        width={"100%"}
        height={"400px"}
      />

      {/* Biểu đồ Lượt đăng nhập */}
      <Chart
        chartType="ColumnChart"
        data={logins}
        options={{
          title: "User Logins",
          chartArea: { width: "80%", height: "70%" },
          hAxis: { title: "Time Period" },
          vAxis: { title: "Logins", minValue: 0 },
        }}
        width={"100%"}
        height={"400px"}
      />

      {/* Biểu đồ Tổng số lượt đăng nhập */}
      <Chart
        chartType="Gauge"
        data={[
          ["Label", "Value"],
          ["Total Logins", totalLogins],
        ]}
        options={{
          width: 400,
          height: 200,
          minorTicks: 5,
          max: adjustedMax, // Chỉnh giá trị max dựa trên dự đoán số logins cao nhất
        }}
        width={"100%"}
        height={"300px"}
      />
    </div>
  );
};

export default AdminDashboard;