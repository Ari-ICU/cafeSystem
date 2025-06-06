import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("🔍 Checking authentication via /api/check-auth...");
        const res = await fetch("/api/check-auth", {
          credentials: "include", 
        });

        if (res.ok) {
          console.log("✅ Authenticated");
          setIsAuthenticated(true);
        } else {
          console.warn("🚫 Not authenticated. Status:", res.status);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("❌ Auth check failed:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    console.log("⏳ Still checking auth...");
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;



//local secure
// import React from "react";
// import { Navigate } from "react-router-dom";

// const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
//   const authToken = localStorage.getItem("authToken");

//   if (!authToken) {
//     console.warn("🚫 No auth token found. Redirecting to login...");
//     return <Navigate to="/login" />;
//   }

//   console.log("✅ Auth token found. Access granted.");
//   return children;
// };

// export default PrivateRoute;
