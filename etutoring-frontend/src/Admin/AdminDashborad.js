import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";
import "./AdminDashborad.css";

const AdminDashboard = () => {
  const [meetingTutor, setMeetingTutor] = useState([["Tutor", "Meetings"]]);
  const [meetingSubject, setMeetingSubject] = useState([["Subject", "Meetings"]]);
  const [totalLogins, setTotalLogins] = useState(0);
  const [messageData, setMessageData] = useState([["user", "Number of messages"]]);
  const [staffRequestData, setStaffRequestData] = useState([["Day", "Number of requests"]]);

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
        const data = [["User", "Number of messages"]];
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

        <div className="dashboard-card">
          <h3 className="chart-title">Number of meetings per tutor</h3>
          <Chart
            chartType="ColumnChart"
            data={meetingTutor}
            options={{
              legend: { position: "none" },
              hAxis: { title: "Tutor" },
              vAxis: { title: "Number of meetings" },
              colors: ["#4285F4"],
            }}
            width={"100%"}
            height={"300px"}
          />
        </div>

        <div className="dashboard-card">
          <h3 className="chart-title">Number of meetings per subject</h3>
          <Chart
            chartType="ColumnChart"
            data={meetingSubject}
            options={{
              legend: { position: "none" },
              hAxis: { title: "Subject" },
              vAxis: { title: "Number of meetings" },
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
              title: "Logins by Day Chart",
              curveType: "function",
              legend: { position: "bottom" },
              hAxis: { title: "Date" },
              vAxis: { title: "Logins" },
            }}
          />
        </div>

        <div className="dashboard-card gauge-card">
          <h3 className="chart-title">Total user logins</h3>
          <Chart
            chartType="ColumnChart"
            data={[
              ["Statistical", "Number of logins"],
              ["Total login", totalLogins],
            ]}
            options={{
              title: "Number of logins",
              legend: { position: "none" },
              hAxis: { title: "Statistics type" },
              vAxis: { title: "Number of logins" },
              colors: ["#fbbc05"],
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
