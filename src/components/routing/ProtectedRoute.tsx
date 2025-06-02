
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
  const hasAccess = isAuthenticated && hasPermission(user, requiredRole);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (isAuthenticated && !hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
