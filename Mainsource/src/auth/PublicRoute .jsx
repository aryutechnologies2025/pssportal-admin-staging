import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const user = localStorage.getItem("pssuser");
  const loggedIn = sessionStorage.getItem("admin_logged_in");

  // Redirect ONLY if fully authenticated
  if (user && loggedIn === "true") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
