const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const { authMiddleware } = require("../middleware/authMiddleware");
const Subject = require('../Models/Subject');


const router = express.Router();


router.post("/login", async (req, res) => {
  try {
    console.log("🔹 Nhận request đăng nhập:", req.body);
    const { email, password } = req.body;

    const user = await User.findOne({ email }); 
    if (!user) return res.status(400).json({ message: "Email does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ 
      message: "Login successful", 
      token, 
      userId: user._id,
      role: user.role 
  });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    let { name, email, phone, password, role, gender, address, created_by, tutor_id, subjects } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name, email, phone, password: hashedPassword, role, gender, address, created_by, tutor_id, subjects
    });

    await newUser.save();
    res.status(201).json({ message: "Registration successful", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/logout", authMiddleware, (req, res) => {
  console.log(`📤 User ${req.user.userId} Logout successful`);
  res.json({ message: "Logout successful" });
});


router.delete("/:id" , async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "No staff found to delete" });

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

router.post("/request-authorization", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user;
    const { reason } = req.body;

    const user = await User.findById(userId);
    if (!user || user.role !== "staff") {
      return res.status(400).json({ message: "You cannot submit this request." });
    }

    user.requestReason = reason;
    user.requestDate = new Date();
    user.requestStatus = "pending";
    await user.save();

    res.json({ message: "Request sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find({ requestStatus: "pending" });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
});

router.get("/liststaff", async (req, res) => {
  try {
    const users = await User.find({ role : "staff" });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
});

router.put("/approve/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "You do not have permission to perform this action." });
    }

    const user = await User.findById(req.params.id);
    if (!user || user.requestStatus !== "pending") {
      return res.status(404).json({ message: "No valid upgrade request found" });
    }

    user.role = "authorized";
    user.requestStatus = "approved";
    await user.save();

    res.json({ message: "Request approved successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

router.put("/reject/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "You do not have permission to perform this action." });
    }

    const user = await User.findById(req.params.id);
    if (!user || user.requestStatus !== "pending") {
      return res.status(404).json({ message: "No valid upgrade request found" });
    }

    user.requestStatus = "rejected";
    await user.save();

    res.json({ message: "Request denied successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});


router.post("/create-student", authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, gender, address, tutor_id, password } = req.body;
    const created_by = req.user.userId;

    if (!["authorized"].includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission to create students." });
    }

    if (!password) {
      return res.status(400).json({ message: "Please enter password" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    if (tutor_id) {
      const tutor = await User.findById(tutor_id);
      if (!tutor || tutor.role !== "tutor") {
        return res.status(400).json({ message: "Invalid tutor" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "student",
      gender,
      address,
      tutor_id,
      created_by,
    });

    await newStudent.save();
    res.status(201).json({ message: "Creating successful students", student: newStudent });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


router.post("/create-tutor", authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, gender, address, password } = req.body;
    const created_by = req.user.userId;

    if (req.user.role !== "authorized") {
      return res.status(403).json({ message: "You do not have permission to create tutors" });
    }

    if (!password) {
      return res.status(400).json({ message: "Please enter password" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newTutor = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "tutor",
      gender,
      address,
      created_by,
    });

    await newTutor.save();
    res.status(201).json({ message: "Create successful tutors", tutor: newTutor });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


router.put("/assign-tutor", authMiddleware, async (req, res) => {
  try {
    const { studentIds, tutorId } = req.body;

    if (studentIds.length > 10) {
      return res.status(400).json({ message: "Only a maximum of 10 students can be assigned at a time" });
    }

    const tutor = await User.findById(tutorId);
    if (!tutor || tutor.role !== "tutor") {
      return res.status(400).json({ message: "Invalid tutor"});
    }

    await User.updateMany(
      { _id: { $in: studentIds }, role: "student" },
      { tutor_id: tutorId }
    );

    res.json({ message: "Successful tutor allocation" });
  } catch (error) {
    console.error("Error allocating tutor:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/students-by-creator", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({ 
        created_by: req.user.userId, 
        role: { $in: ["student", "tutor"] }
    });
    res.json(users);
} catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
}
});

router.get("/tutors", authMiddleware, async (req, res) => {
  try {
      const tutors = await User.find({ role: "tutor" }).select("_id name email");
      res.json(tutors);
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/students-with-tutors", authMiddleware, async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .populate({ path: "tutor_id", model: "user", select: "name email" });

    res.json(students);
  } catch (error) {
    console.error("Error getting student list:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/all-tutors", authMiddleware, async (req, res) => {
  try {
    const tutors = await User.find({ role: "tutor" }).select("_id name email");
    res.json(tutors);
  } catch (error) {
    console.error("Error getting Tutor list:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


router.get('/role', async (req, res) => {
  try {
      let query = {};
      if (req.query.tutors) query.role = "tutor";
      if (req.query.students) query.role = "student";

      const users = await User.find(query);
      res.json(users);
  } catch (error) {
      res.status(500).json({ message: "Error while getting user list", error });
  }
});


router.get("/students", authMiddleware, async (req, res) => {
  try {
    const { tutor_id } = req.query;
    if (!tutor_id) {
      return res.status(400).json({ message: "Missing tutor_id" });
    }
    const students = await User.find({ tutor_id, role: "student" });
    res.status(200).json(students);
  } catch (error) {
    console.error("Error getting student list:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/:id" , async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "No staff found"});

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!updatedUser) return res.status(404).json({ message: "No staff found" });

    res.json({ message: "Updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



module.exports = router;
