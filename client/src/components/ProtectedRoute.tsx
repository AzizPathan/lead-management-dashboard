import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = () => {
  const { token, isBootstrapping } = useAuth();
  if (isBootstrapping) return <div className="grid min-h-screen place-items-center text-slate-600">Loading workspace...</div>;
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};
