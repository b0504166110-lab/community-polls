import { useAppSelector } from "../store/store";
import { Link } from "react-router-dom";
import LogOut from "../components/LogOut";

function NavBar() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <nav>
      {user ? (
        <>
          <span>שלום {user.name}</span> | <Link to="/polls">סקרים</Link> |{" "}
          <Link to="/polls/new">סקר חדש</Link>|
          <Link to="/my-polls">לסקרים שלי</Link>
          {user.role === "ADMIN" && (
            <>
              {" "}
              | <Link to="/admin">לתפריט הניהול</Link>
            </>
          )}
          <LogOut />
        </>
      ) : (
        <>
          <Link to="/polls">סקרים</Link> | <Link to="/login">התחברות</Link> |{" "}
          <Link to="/register">הרשמה</Link>
        </>
      )}
    </nav>
  );
}
export default NavBar;
