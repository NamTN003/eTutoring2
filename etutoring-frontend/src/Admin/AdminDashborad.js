import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";
import "./AdminDashborad.css";

const AdminDashboard = () => {
  const [meetingTutor, setMeetingTutor] = useState([["Tutor", "Meetings"]]);
  const [meetingSubject, setMeetingSubject] = useState([["Subject", "Meetings"]]);
  const [totalLogins, setTotalLogins] = useState(0);
  const [messageData, setMessageData] = useState([["Người dùng", "Số tin nhắn"]]);
  const [staffRequestData, setStaffRequestData] = useState([["Ngày", "Số yêu cầu"]]);

  const [accounts, setAccounts] = useState([
    ["Role", "Total"],
    ["Students", 0],
    ["Tutors", 0],
    ["Staff", 0],
    ["Authorized", 0],
  ]);

  const [logins, setLogins] = useState([
    ["Period", "Logins"],
    ["Today", 0],
    ["This Week", 0],
    ["This Month", 0],
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

        const meetingTutor = await axios.get("http://localhost:5000/dashboard/meeting-tutor-count");
        const meetingSubject = await axios.get("http://localhost:5000/dashboard/meeting-subject-count");
        const tutorCount = [["Tutor", "Meetings"]];
        meetingTutor.data.forEach(item => {
          tutorCount.push([`Tutor ${item.tutor_id}`, item.meetingCount]);
        });
        const subjectCount = [["Subject", "Meetings"]];
        meetingSubject.data.forEach(item => {
          subjectCount.push([`Subject ${item.subject_id}`, item.meetingCount]);
        });

        setMeetingTutor(tutorCount);
        setMeetingSubject(subjectCount);


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

        const messageData = await axios.get("http://localhost:5000/dashboard/message-count");
        const data = [["Người dùng", "Số tin nhắn"]];
        messageData.data.forEach((item) => {
          data.push([item.name, item.messageCount]);
        });

        setMessageData(data);

        axios.get("http://localhost:5000/dashboard/staff-auth-request-count").then((res) => {
          setStaffRequestData(res.data);
        });

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
          <h3 className="chart-title">Số cuộc họp của mỗi gia sư</h3>
          <Chart
            chartType="ColumnChart"
            data={meetingTutor}
            options={{
              legend: { position: "none" },
              hAxis: { title: "Gia sư" },
              vAxis: { title: "Số cuộc họp" },
              colors: ["#4285F4"],
            }}
            width={"100%"}
            height={"300px"}
          />
        </div>

        <div className="dashboard-card">
          <h3 className="chart-title">Số cuộc họp của mỗi môn học</h3>
          <Chart
            chartType="ColumnChart"
            data={meetingSubject}
            options={{
              legend: { position: "none" },
              hAxis: { title: "Môn học" },
              vAxis: { title: "Số cuộc họp" },
              colors: ["#4285F4"],
            }}
            width={"100%"}
            height={"300px"}
          />
        </div>

        <div className="dashboard-card">
          <Chart
            chartType="LineChart"
            width="100%"
            height="400px"
            data={logins}
            options={{
              title: "Biểu đồ lượt đăng nhập theo ngày",
              curveType: "function",
              legend: { position: "bottom" },
              hAxis: { title: "Ngày" },
              vAxis: { title: "Lượt đăng nhập" },
            }}
          />
        </div>

        <div className="dashboard-card gauge-card">
          <h3 className="chart-title">Tổng số lượt đăng nhập của người dùng</h3>
          <Chart
            chartType="ColumnChart"
            data={[
              ["Thống kê", "Số lượt đăng nhập"],
              ["Tổng login", totalLogins],
            ]}
            options={{
              title: "Tổng số lượt đăng nhập",
              legend: { position: "none" },
              hAxis: { title: "Loại thống kê" },
              vAxis: { title: "Số lượt đăng nhập" },
              colors: ["#fbbc05"],
            }}
            width={"100%"}
            height={"300px"}
          />
        </div>
        
        <div>
          <h3>💬 Số lượng tin nhắn theo người dùng</h3>
          <Chart
            chartType="ColumnChart"
            width="100%"
            height="400px"
            data={messageData}
            options={{
              title: "Số tin nhắn gửi bởi từng người dùng",
              legend: { position: "none" },
              hAxis: { title: "Người dùng" },
              vAxis: { title: "Số tin nhắn" },
              colors: ["#34a853"],
            }}
          />
        </div>

        <div>
          <h3>💬 Số lượng yêu cầu ủy quyền của Staff</h3>
          <Chart
            chartType="LineChart"
            width="100%"
            height="400px"
            data={staffRequestData}
            options={{
              title: "Số yêu cầu ủy quyền từ Staff theo ngày trong tháng",
              hAxis: { title: "Ngày" },
              vAxis: { title: "Số yêu cầu" },
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
