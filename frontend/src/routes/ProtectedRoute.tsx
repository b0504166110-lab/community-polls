import type { ReactNode } from "react";
import { useAppSelector } from "../store/store";
import { Navigate, useLocation } from "react-router-dom";
function ProtectedRoute({
  children,
  adminOnly = false,
}: {
  children: ReactNode;
  adminOnly?: boolean;
}) {
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);
  const isChecking = useAppSelector((state) => state.auth.isChecking);
  if (isChecking) {
    return <p>טוען...</p>;
  }
  if (user == null) {
    const from = location.pathname + location.search;
    return <Navigate to="/login" state={{ from }} />;
  }
  if (adminOnly && user.role !== "ADMIN") {
    return <Navigate to="/polls" />;
  }
  return <>{children}</>;
}
export default ProtectedRoute;
