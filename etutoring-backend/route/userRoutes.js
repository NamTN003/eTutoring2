const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../Models/User");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Đăng nhập
router.post("/login", async (req, res) => {
  try {
    console.log("🔹 Nhận request đăng nhập:", req.body);
    const { email, password } = req.body;

    const user = await User.findOne({ email }); 
    if (!user) return res.status(400).json({ message: "Email không tồn tại" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mật khẩu không đúng" });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ 
      message: "Đăng nhập thành công", 
      token, 
      userId: user._id, // ✅ Trả về userId
      role: user.role 
  });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// Đăng ký
router.post("/register", async (req, res) => {
  try {
    let { name, email, phone, password, role, gender, address, created_by, tutor_id, subjects } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email đã tồn tại" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name, email, phone, password: hashedPassword, role, gender, address, created_by, tutor_id, subjects
    });

    await newUser.save();
    res.status(201).json({ message: "Đăng ký thành công", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// Đăng xuất
router.post("/logout", authMiddleware, (req, res) => {
  console.log(`📤 Người dùng ${req.user.userId} đã đăng xuất.`);
  res.json({ message: "Đăng xuất thành công" });
});


// Xóa người dùng
router.delete("/:id" , async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy nhân viên để xóa" });

    res.json({ message: "Xóa nhân viên thành công" });
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
      return res.status(400).json({ message: "Bạn không thể gửi yêu cầu này" });
    }

    user.requestReason = reason;
    user.requestDate = new Date();
    user.requestStatus = "pending";
    await user.save();

    res.json({ message: "Gửi yêu cầu thành công!" });
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

// Xử lý yêu cầu duyệt hoặc từ chối nâng cấp
router.put("/approve/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Bạn không có quyền thực hiện thao tác này" });
    }

    const user = await User.findById(req.params.id);
    if (!user || user.requestStatus !== "pending") {
      return res.status(404).json({ message: "Không tìm thấy yêu cầu nâng cấp hợp lệ" });
    }

    user.role = "authorized"; // Thay đổi role
    user.requestStatus = "approved"; // Cập nhật trạng thái
    await user.save();

    res.json({ message: "Duyệt yêu cầu thành công", user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

router.put("/reject/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Bạn không có quyền thực hiện thao tác này" });
    }

    const user = await User.findById(req.params.id);
    if (!user || user.requestStatus !== "pending") {
      return res.status(404).json({ message: "Không tìm thấy yêu cầu nâng cấp hợp lệ" });
    }

    user.requestStatus = "rejected"; // Từ chối yêu cầu
    await user.save();

    res.json({ message: "Từ chối yêu cầu thành công", user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});


router.post("/create-student", authMiddleware, async (req, res) => {
  try {
      const { name, email, phone, gender, address, tutor_id } = req.body;
      const created_by = req.user.userId; // Lấy ID của người tạo

      // Kiểm tra nếu người tạo không phải là tutor hoặc admin
      if (!["authorized"].includes(req.user.role)) {
          return res.status(403).json({ message: "Bạn không có quyền tạo sinh viên" });
      }

      // Kiểm tra email có tồn tại không
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "Email đã tồn tại" });

      // Kiểm tra tutor_id có hợp lệ không
      if (tutor_id) {
        const tutor = await User.findById(tutor_id);
        if (!tutor || tutor.role !== "tutor") {
            return res.status(400).json({ message: "Gia sư không hợp lệ" });
        }
    }

      const hashedPassword = await bcrypt.hash("123456", 10); // Mật khẩu mặc định

      const newStudent = new User({
          name,
          email,
          phone,  
          password: hashedPassword,
          role: "student",
          gender,
          address,
          tutor_id, // Lưu ID của gia sư
          created_by, // Gán ID của tutor/admin làm người tạo
      });

      await newStudent.save();
      res.status(201).json({ message: "Tạo sinh viên thành công", student: newStudent });
  } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// 📌 API lấy danh sách sinh viên do người tạo tạo ra
// router.get("/students-by-creator", authMiddleware, async (req, res) => {
//   try {
//       const students = await User.find({ created_by: req.user.userId, role: "student" });
//       res.json(students);
//   } catch (error) {
//       res.status(500).json({ message: "Lỗi server", error: error.message });
//   }
// });

router.post("/create-tutor", authMiddleware, async (req, res) => {
  try {
      const { name, email, phone, gender, address } = req.body;
      const created_by = req.user.userId; // Lấy ID của người tạo

      // Chỉ admin mới có quyền tạo tutor
      if (req.user.role !== "authorized") {
          return res.status(403).json({ message: "Bạn không có quyền tạo gia sư" });
      }

      // Kiểm tra email có tồn tại không
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "Email đã tồn tại" });

      const hashedPassword = await bcrypt.hash("123456", 10); // Mật khẩu mặc định

      const newTutor = new User({
          name,
          email,
          phone,
          password: hashedPassword,
          role: "tutor",
          gender,
          address,
          created_by, // Gán ID của admin làm người tạo
      });

      await newTutor.save();
      res.status(201).json({ message: "Tạo gia sư thành công", tutor: newTutor });
  } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});


router.put("/assign-tutor", authMiddleware, async (req, res) => {
  try {
    const { studentIds, tutorId } = req.body;

    // Kiểm tra số lượng sinh viên tối đa
    if (studentIds.length > 10) {
      return res.status(400).json({ message: "Chỉ có thể phân bổ tối đa 10 sinh viên cùng lúc" });
    }

    // Kiểm tra tutor có hợp lệ không
    const tutor = await User.findById(tutorId);
    if (!tutor || tutor.role !== "tutor") {
      return res.status(400).json({ message: "Gia sư không hợp lệ" });
    }

    // Cập nhật tutor_id cho các sinh viên được chọn
    await User.updateMany(
      { _id: { $in: studentIds }, role: "student" },
      { tutor_id: tutorId }
    );

    res.json({ message: "Phân bổ gia sư thành công" });
  } catch (error) {
    console.error("❌ Lỗi khi phân bổ gia sư:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

router.get("/students-by-creator", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({ 
        created_by: req.user.userId, 
        role: { $in: ["student", "tutor"] } // Lấy cả student & tutor
    });
    res.json(users);
} catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
}
});

router.get("/tutors", authMiddleware, async (req, res) => {
  try {
      const tutors = await User.find({ role: "tutor" }).select("_id name email");
      res.json(tutors);
  } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

router.get("/students-with-tutors", authMiddleware, async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .populate({ path: "tutor_id", model: "user", select: "name email" }); // ✅ Chỉ định model "user"

    res.json(students);
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách sinh viên:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

router.get("/all-tutors", authMiddleware, async (req, res) => {
  try {
    const tutors = await User.find({ role: "tutor" }).select("_id name email");
    res.json(tutors);
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách gia sư:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
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
      res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng", error });
  }
});


router.get("/students", authMiddleware, async (req, res) => {
  try {
    const { tutor_id } = req.query; // Lấy từ query thay vì params
    if (!tutor_id) {
      return res.status(400).json({ message: "Thiếu tutor_id" });
    }
    const students = await User.find({ tutor_id, role: "student" });
    res.status(200).json(students);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách học sinh:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// Lấy thông tin người dùng theo ID
router.get("/:id" , async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy nhân viên" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Cập nhật thông tin người dùng
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!updatedUser) return res.status(404).json({ message: "Không tìm thấy nhân viên" });

    res.json({ message: "Cập nhật thành công", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

module.exports = router;
