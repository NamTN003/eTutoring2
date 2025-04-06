import React from "react";
import { Navigate } from "react-router-dom";

const roleHomePages = {
  admin: "/homeadmin",
  staff: "/homestaff",
  authorized: "/homeauthorized",
  tutor: "/hometutor",
  student: "/homestudent",
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = localStorage.getItem("role"); // Lấy role từ localStorage

  if (!allowedRoles.includes(role)) {
    alert("Bạn không có quyền vào đây");
    const homePage = roleHomePages[role] || "/";
    return <Navigate to={homePage} replace />;
  }

  return children;
};

export default ProtectedRoute;