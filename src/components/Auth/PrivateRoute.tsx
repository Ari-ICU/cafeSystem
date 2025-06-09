import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import LoginService from "../../Services/LoginService";

const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        console.log("🔍 Checking authentication...");
        const isAuth = await LoginService.isAuthenticated();
        setIsAuthenticated(isAuth);
        console.log("✅ Authenticated:", isAuth);
      } catch (error: any) {
        console.error("❌ Auth check failed:", error);
        setIsAuthenticated(false);
      }
    };
    verifyAuth();
  }, []);

  if (isAuthenticated === null) {
    console.log("⏳ Still checking auth...");
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
