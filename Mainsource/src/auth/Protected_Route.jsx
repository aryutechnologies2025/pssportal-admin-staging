// import { Navigate, Outlet } from "react-router-dom";

// const ProtectedRoute = ({  requiredRole, permissionTitle }) => {
//   const user = JSON.parse(localStorage.getItem("pssuser"));
//   const module = JSON.parse(localStorage.getItem("module")) || [];
//   const allowedRoles = [].concat(requiredRole || []);

//   if (!user) {
//     return <Navigate to="/" replace />;
//   }


//   if (allowedRoles.length && !allowedRoles.includes(user?.type)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   if (permissionTitle) {
//     const hasPermission = module.some(
//       (item) =>
//         item.title === permissionTitle &&
//         item.permission?.toLowerCase() === "yes"
//     );

//     if (!hasPermission) {
//       return <Navigate to="/unauthorized" replace />;
//     }
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;



import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("pssuser"));

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  const isAdmin = String(user?.role_id) === "1";

  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
