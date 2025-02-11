import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  // Use the same key names as in your sign-in logic
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("userRole");

  // Check if the token exists and the role matches one of the allowed roles
  if (!token || !allowedRoles.includes(role)) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
