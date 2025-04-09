const express = require("express");
const router = express.Router();
const User = require("../../Models/User");
const Meeting = require("../../Models/Metting");
const Message = require("../../Models/Message")
const Subject = require("../../Models/Subject");

router.get("/total-accounts", async (req, res) => {
  try {
    const students = await User.countDocuments({ role: "student" });
    const tutors = await User.countDocuments({ role: "tutor" });
    const staff = await User.countDocuments({ role: "staff" });
    const authorized = await User.countDocuments({ role: "authorized" });

    res.json({ students, tutors, staff, authorized });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.get("/total-login-count", async (req, res) => {
    try {
      const totalLoginCount = await User.aggregate([
        { $group: { _id: null, totalLoginCount: { $sum: "$loginCount" } } }
      ]);
  
      res.json({ totalLoginCount: totalLoginCount[0]?.totalLoginCount || 0 });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  });
  

  router.get("/login-daily-count", async (req, res) => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
      const result = await LoginLog.aggregate([
        {
          $match: {
            login_time: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        {
          $group: {
            _id: {
              day: { $dayOfMonth: "$login_time" },
            },
            loginCount: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.day": 1 },
        },
      ]);
  
      const totalDays = endOfMonth.getDate();
      const data = [];
  
      for (let i = 1; i <= totalDays; i++) {
        const found = result.find((r) => r._id.day === i);
        data.push({
          day: `${i < 10 ? "0" + i : i}/${now.getMonth() + 1}`,
          loginCount: found ? found.loginCount : 0,
        });
      }
  
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  });
  

router.get("/login-stats", async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const startOfMonth = new Date(today.setDate(1));

    const daily = await User.countDocuments({ lastLogin: { $gte: startOfDay } });
    const weekly = await User.countDocuments({ lastLogin: { $gte: startOfWeek } });
    const monthly = await User.countDocuments({ lastLogin: { $gte: startOfMonth } });

    res.json({ daily, weekly, monthly });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});


router.get("/student-count/:tutorId", async (req, res) => {
  const tutorId = req.params.tutorId;

  if (!tutorId) {
    return res.status(400).json({ message: "Missing tutor ID" });
  }

  try {
    const studentCount = await User.countDocuments({ role: "student", tutor_id: tutorId });
    res.json({ studentCount });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});


router.get("/meeting-tutor-count", async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const meetingsPerTutor = await Meeting.aggregate([
      {
        $match: {
          meeting_date: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: "$tutor_id",
          meetingCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          tutor_id: "$_id",
          meetingCount: 1,
        },
      },
      {
        $sort: { meetingCount: -1 },
      },
    ]);

    res.json(meetingsPerTutor);
  } catch (error) {
    console.error("Lỗi khi thống kê cuộc họp:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/meeting-subject-count", async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const meetingsPerSubject = await Meeting.aggregate([
      {
        $match: {
          meeting_date: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: "$subject_id",
          meetingCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          subject_id: "$_id",
          meetingCount: 1,
        },
      },
      {
        $sort: { meetingCount: -1 },
      },
    ]);

    res.json(meetingsPerSubject);
  } catch (error) {
    console.error("Lỗi khi thống kê cuộc họp:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


router.get("/student-meeting-count/:studentId", async (req, res) => {
  const studentId = req.params.studentId;

  if (!studentId) {
    return res.status(400).json({ message: "Missing student ID" });
  }

  try {
    const meetingCount = await Meeting.countDocuments({ student_ids: studentId });
    res.json({ meetingCount });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.get("/message-count", async (req, res) => {
  try {
    const result = await Message.aggregate([
      {
        $group: {
          _id: "$sender_id",
          messageCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "user",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 0,
          user_id: "$_id",
          name: "$user.name",
          messageCount: 1,
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    console.error("Lỗi API:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});


router.get("/staff-auth-request-count", async (req, res) => {
  try {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const requestsByDay = await User.aggregate([
      {
        $match: {
          role: "staff",
          requestDate: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$requestDate" },
          totalRequests: { $sum: 1 },
        },
      },
      {
        $sort: { "_id": 1 },
      },
    ]);

    const chartData = [["Ngày", "Số yêu cầu"]];
    for (let i = 1; i <= endOfMonth.getDate(); i++) {
      const found = requestsByDay.find((d) => d._id === i);
      chartData.push([i, found ? found.totalRequests : 0]);
    }

    res.json(chartData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;