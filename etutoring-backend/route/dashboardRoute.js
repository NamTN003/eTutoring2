const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../Models/User");
const Meeting = require("../Models/Metting");
const Message = require("../Models/Message");
const Subject = require("../Models/Subject");
const {authMiddleware} = require("../middleware/authMiddleware");
const moment = require("moment");


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


router.get("/user-info", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("name email role");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


router.get("/my-simple-dashboard", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const totalMeetings = await Meeting.countDocuments({
      "attendance": {
        $elemMatch: {
          student: userId,
          status: "present"
        }
      }
    });
    
    const subjects = await Subject.find({ tutors: userId });

    res.json({ totalMeetings, subjects });
  } catch (err) {
    console.error("Lỗi khi lấy dashboard:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

router.get("/weekly-meetings", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const startOfWeek = moment().startOf("isoWeek").toDate();
    const endOfWeek = moment().endOf("isoWeek").toDate();

    const count = await Meeting.countDocuments({
      meeting_date: { $gte: startOfWeek, $lte: endOfWeek },
      attendance: {
        $elemMatch: {
          user_id: userId,
          status: "present"
        }
      }
    });

    res.json({ weeklyMeetings: count });
  } catch (err) {
    console.error("Lỗi khi lấy số buổi học trong tuần:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});


router.get("/my-meetings", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    const meetings = await Meeting.find({ student_ids: userId })
      .populate("subject_id", "name")
      .sort({ date: -1 });

    res.json(meetings);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

router.get("/my-subjects", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const subjectIds = await Meeting.distinct("subject_id", {
      student_ids: userId,
    });

    const subjects = await Subject.find({ _id: { $in: subjectIds } }).select("name");

    res.json(subjects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/my-subjects-count", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    const subjects = await Meeting.distinct("subject_id", { student_ids: userId });
    res.json({ subjectCount: subjects.length });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

router.get("/student-daily-meetings", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const data = await Meeting.aggregate([
      {
        $match: {
          students: userId,
          meeting_date: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
          attendance: {
            $elemMatch: {
              student: userId,
              status: "present",
            },
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$meeting_date" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ dailyMeetings: data });
  } catch (error) {
    console.error("Lỗi khi thống kê daily meetings:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
});


router.get("/tutor-summary", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const totalMeetings = await Meeting.countDocuments({ tutor_id: userId });

    const subjects = await Subject.find({ tutors: userId });

    res.json({ totalMeetings, subjects });
  } catch (err) {
    console.error("❌ Lỗi khi lấy tutor summary:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});



module.exports = router;