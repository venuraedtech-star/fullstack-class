import { useDispatch, useSelector } from "react-redux";
import {
  login as loginThunk,
  register as registerThunk,
  logout as logoutThunk,
} from "../store/authSlice";

export default function useAuth() {
  const dispatch = useDispatch();
  const { user, accessToken, status, error, loading } = useSelector(
    (state) => state.auth,
  );

  async function login(email, password) {
    const result = await dispatch(loginThunk({ email, password }));
    if (loginThunk.rejected.match(result)) {
      throw new Error(result.payload || "Login failed");
    }
  }

  async function register(name, email, password) {
    const result = await dispatch(registerThunk({ name, email, password }));
    if (registerThunk.rejected.match(result)) {
      throw new Error(result.payload || "Registration failed");
    }
  }

  function logout() {
    dispatch(logoutThunk());
  }

  return {
    user,
    accessToken,
    status,
    error,
    loading,
    isLoggedIn: !!user,
    login,
    register,
    logout,
  };
}
