import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [totalMeetings, setTotalMeetings] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [weeklyMeetings, setWeeklyMeetings] = useState(0);
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("⚠️ Không có token, từ chối truy cập.");
          return;
        }

        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const userId = decodedToken.userId;
        const headers = { Authorization: `Bearer ${token}` };

        const [userRes, dashboardRes, weeklyRes, dailyRes] = await Promise.all([
          axios.get(`http://localhost:5000/user/${userId}`, { headers }),
          axios.get("http://localhost:5000/dashboard/my-simple-dashboard", { headers }),
          axios.get("http://localhost:5000/dashboard/weekly-meetings", { headers }),
          axios.get("http://localhost:5000/dashboard/student-daily-meetings", { headers }),
        ]);

        setUserData(userRes.data);
        setTotalMeetings(dashboardRes.data.totalMeetings || 0);
        setSubjects(dashboardRes.data.subjects || []);
        setWeeklyMeetings(weeklyRes.data.weeklyMeetings || 0);

        const rawData = dailyRes.data.dailyMeetings || [];
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        const chartArray = [["Ngày", "Số buổi học"]];

        for (let day = 1; day <= daysInMonth; day++) {
          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const found = rawData.find((item) => item._id === dateStr);
          chartArray.push([String(day), found ? found.count : 0]);
        }

        setDailyData(chartArray);
        setLoading(false);
      } catch (error) {
        console.error("❌ Lỗi khi lấy dữ liệu dashboard:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <p className="dashboard-loading">Đang tải dữ liệu...</p>;
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">📊 Student Dashboard</h2>

      <div className="dashboard-overview">
        <h2>👋 Xin chào, {userData?.name}</h2>
        <p><strong>Email:</strong> {userData?.email}</p>

        <div className="dashboard-cards-grid">
          <div className="dashboard-chart">
            <h3>📈 Biểu đồ số buổi học theo ngày (trong tháng)</h3>
            <Chart
              chartType="ColumnChart"
              width="100%"
              height="300px"
              data={dailyData}
              options={{
                legend: { position: "none" },
                hAxis: { title: "Ngày" },
                vAxis: { title: "Số buổi học", minValue: 0 },
                colors: ["#4285F4"],
              }}
            />
          </div>

          <div className="dashboard-card">
            <h3>📚 Danh sách môn học</h3>
            {subjects.length === 0 ? (
              <p>Chưa có môn học nào.</p>
            ) : (
              <ul>
                {subjects.map((subject) => (
                  <li key={subject._id}>{subject.subject_name || "Không có tên"}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="dashboard-card">
            <h3>📌 Tổng số buổi học đã tham gia</h3>
            <p className="big-number">{totalMeetings}</p>
          </div>

          <div className="dashboard-card">
            <h3>📆 Số buổi học trong tuần này</h3>
            <p className="big-number">{weeklyMeetings}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
