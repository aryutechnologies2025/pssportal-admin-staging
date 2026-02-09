// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// export function useTokenExpiry() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkTokenExpiry = () => {
//       const expiresAt = localStorage.getItem("admin_token_expires");
      
//       if (!expiresAt) return;

//       const expiryTime = new Date(expiresAt).getTime();
//       const currentTime = Date.now();
//       const timeRemaining = expiryTime - currentTime;

//       // Warn user 5 minutes before expiry
//       if (timeRemaining > 0 && timeRemaining < 5 * 60 * 1000) {
//         console.warn("Token expiring soon!");
//       }

//       // Logout if expired
//       if (timeRemaining <= 0) {
//         localStorage.removeItem("admin_token");
//         localStorage.removeItem("admin_token_expires");
//         localStorage.removeItem("pssuser");
//         sessionStorage.removeItem("admin_logged_in");
//         navigate("/login", { replace: true });
//       }
//     };

//     const interval = setInterval(checkTokenExpiry, 60000); // Check every minute
//     return () => clearInterval(interval);
//   }, [navigate]);
// }


import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useTokenExpiry() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiry = () => {
      const expiresAt = localStorage.getItem("admin_token_expires");
      
      if (!expiresAt) return;

      const expiryTime = new Date(expiresAt).getTime();
      const currentTime = Date.now();
      const timeRemaining = expiryTime - currentTime;

      // Warn user 5 minutes before expiry
      if (timeRemaining > 0 && timeRemaining < 5 * 60 * 1000) {
        console.warn("Token expiring soon!");
      }

      // Logout if expired
      if (timeRemaining <= 0) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_token_expires");
        localStorage.removeItem("pssuser");
        sessionStorage.removeItem("admin_logged_in");
        navigate("/", { replace: true });
      }
    };

    const interval = setInterval(checkTokenExpiry, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [navigate]);
}
