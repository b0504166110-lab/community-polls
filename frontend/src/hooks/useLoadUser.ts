import { useEffect } from "react";
import { useAppDispatch } from "../store/store";
import { getMe } from "../api/authService";
import { setUser, logout } from "../store/authSlice";
import { getToken, deleteToken } from "../utils/tokenStorage";
function useLoadUser() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!getToken()) return;
    getMe()
      .then((me) => dispatch(setUser(me)))
      .catch(() => {
        deleteToken();
        dispatch(logout());
      });
  }, [dispatch]);
}

export default useLoadUser;
