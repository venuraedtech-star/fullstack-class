import useLocalStorage from "../hooks/useLocalStorage";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage("user", null);

  function login(username) {
    setUser({ username, role: "admin" });
  }

  function logout() {
    setUser(null);
  }

  const value = { user, login, logout, isLoggedIn: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
