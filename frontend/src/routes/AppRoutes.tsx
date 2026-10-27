import type { ReactElement } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import PollsList from "../pages/PollsList";
import PollDetails from "../pages/PollDetails";
import CreatePoll from "../pages/CreatePoll";
import EditPoll from "../pages/EditPoll";
import { useAppSelector } from "../store/store";
import ProtectedRoute from "./ProtectedRoute";
import MyPollsList from "../pages/MyPollsList";
import AdminPage from "../pages/Admin";
import Landing from "../pages/Landing";
import NotFound from "../pages/NotFound";

function RedirectIfLoggedIn({ children }: { children: ReactElement }) {
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();
  if (!user) return children;
  const from = (location.state as { from?: unknown } | null)?.from;

  const target =
    typeof from === "string" && from.startsWith("/") && !from.startsWith("//")
      ? from
      : "/polls";
  return <Navigate to={target} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/polls" element={<PollsList />} />
      <Route
        path="/polls/:id"
        element={
          <ProtectedRoute>
            <PollDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <RedirectIfLoggedIn>
            <LoginPage />
          </RedirectIfLoggedIn>
        }
      />
      <Route
        path="/register"
        element={
          <RedirectIfLoggedIn>
            <RegisterPage />
          </RedirectIfLoggedIn>
        }
      />
      <Route
        path="/polls/new"
        element={
          <ProtectedRoute>
            <CreatePoll />
          </ProtectedRoute>
        }
      />
      <Route
        path="/polls/:id/edit"
        element={
          <ProtectedRoute>
            <EditPoll />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-polls"
        element={
          <ProtectedRoute>
            <MyPollsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
export default AppRoutes;
