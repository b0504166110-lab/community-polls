import { useAppDispatch } from "../store/store";
import { logout } from "../store/authSlice";

function LogoutButton() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
  };

  return <button onClick={handleLogout}>התנתק</button>;
}

export default LogoutButton;
