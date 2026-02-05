import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isLoggedIn, requiredRole, permissionTitle }) => {
  const user = JSON.parse(localStorage.getItem("pssuser"));
  const module = JSON.parse(localStorage.getItem("module")) || [];
  const allowedRoles = [].concat(requiredRole || []);

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (user?.superUser) {
    return <Outlet />;
  }

  if (allowedRoles.length && !allowedRoles.includes(user?.type)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (permissionTitle) {
    const hasPermission = module.some(
      (item) =>
        item.title === permissionTitle &&
        item.permission?.toLowerCase() === "yes"
    );

    if (!hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
