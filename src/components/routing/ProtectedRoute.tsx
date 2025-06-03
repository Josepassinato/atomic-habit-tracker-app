
import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser, hasPermission } from "@/utils/permissions";
import { UserRole } from "@/types/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'vendedor' 
}) => {
  const user = getCurrentUser();
  const isAuthenticated = user !== null;
  
  console.log("ProtectedRoute check:", { user, isAuthenticated, requiredRole });
  
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  const hasAccess = hasPermission(user, requiredRole);
  
  if (isAuthenticated && !hasAccess) {
    console.log("User authenticated but no access, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
