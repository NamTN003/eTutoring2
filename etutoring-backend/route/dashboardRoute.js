const express = require("express");
const router = express.Router();
const User = require("../../Models/User");
const Meeting = require("../../Models/Metting");
const Subject = require("../../Models/Subject");

// 1️⃣ API: Thống kê tổng số tài khoản
router.get("/total-accounts", async (req, res) => {
  try {
    const students = await User.countDocuments({ role: "student" });
    const tutors = await User.countDocuments({ role: "tutor" });
    const staff = await User.countDocuments({ role: "staff" });

    res.json({ students, tutors, staff });
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
  

// 2️⃣ API: Thống kê lượt đăng nhập
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
    // Lấy số lượng học sinh có tutor_id tương ứng
    const studentCount = await User.countDocuments({ role: "student", tutor_id: tutorId });
    res.json({ studentCount });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});


router.get("/meeting-count/:tutorId", async (req, res) => {
  try {
    const tutorId = req.params.tutorId;

    // Lấy ngày đầu và cuối của tháng hiện tại
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    // Đếm số lượng meetings của tutor trong tháng hiện tại
    const meetingCount = await Meeting.countDocuments({
      tutor_id: tutorId,
      meeting_date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    res.json({ meetingCount });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
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

module.exports = router;