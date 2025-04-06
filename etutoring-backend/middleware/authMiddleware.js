const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');

const authMiddleware = (req, res, next) => {

  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    console.log("⚠ Không có token được gửi!");
    return res.status(401).json({ message: "Không có token, từ chối truy cập" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("❌ Token không hợp lệ:", error.message);
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Bạn không có quyền vào đây" });
    }
    next();
  };
};
module.exports = { authMiddleware, checkRole };

module.exports = { authMiddleware };
