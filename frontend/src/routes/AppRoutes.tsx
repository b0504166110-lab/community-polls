import { Routes, Route, Navigate } from "react-router-dom";
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
function AppRoutes() {
  const user = useAppSelector((state) => state.auth.user);
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/polls" element={<PollsList />} />
      <Route path="/polls/:id" element={<ProtectedRoute>
            <PollDetails />{" "}
          </ProtectedRoute>} />
      <Route
        path="/login"
        element={user ? <Navigate to="/polls" /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/polls" /> : <RegisterPage />}
      />
      <Route
        path="/polls/new"
        element={
          <ProtectedRoute>
            <CreatePoll />{" "}
          </ProtectedRoute>
        }
      />
      <Route
        path="/polls/:id/edit"
        element={
          <ProtectedRoute>
            {" "}
            <EditPoll />{" "}
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-polls"
        element={
          <ProtectedRoute>
            {" "}
            <MyPollsList />{" "}
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            {" "}
            <AdminPage />{" "}
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
export default AppRoutes;
