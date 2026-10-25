import { Link } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import LogOut from "./components/LogOut";
import BackButton from "./components/BackButton";
import { useAppDispatch, useAppSelector } from "./store/store";
import { useEffect } from "react";
import { getMe } from "./api/authService";
import { setUser, logout } from "./store/authSlice";

function App() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    getMe()
      .then((me) => dispatch(setUser(me)))
      .catch(() => {
        localStorage.removeItem("token");
        dispatch(logout());
      });
  }, [dispatch]);

  return (
    <main>
      <h1>סקרים בקהילה</h1>

      <nav>
        {user ?(
          <>
            <span>שלום {user.name}</span> | <Link to="/polls">סקרים</Link> | <Link to="/polls/new">סקר חדש</Link>|<Link to="/my-polls">לסקרים שלי</Link>
            {user.role === "ADMIN" && (
              <>
                {" "}| <Link to="/admin">לתפריט הניהול</Link>
              </>
            )}
            <LogOut />
          </>
        ) : (
          <>
            <Link to="/polls">סקרים</Link> | <Link to="/login">התחברות</Link> | <Link to="/register">הרשמה</Link>
          </>
        )}
      </nav>

      <BackButton />

      <AppRoutes/>
    </main>
  );
}

export default App;
