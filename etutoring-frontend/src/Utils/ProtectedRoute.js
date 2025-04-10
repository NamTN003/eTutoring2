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
  const role = localStorage.getItem("role");

  if (!allowedRoles.includes(role)) {
    alert("You do not have permission to enter here");
    const homePage = roleHomePages[role] || "/";
    return <Navigate to={homePage} replace />;
  }

  return children;
};

export default ProtectedRoute;