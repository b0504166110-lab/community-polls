import { useAppDispatch } from "../store/store";
import { logout } from "../store/authSlice";
import { deleteToken } from "../utils/tokenStorage";
function LogoutButton() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    deleteToken();
    dispatch(logout());
  };

  return <button onClick={handleLogout}>התנתק</button>;
}

export default LogoutButton;
