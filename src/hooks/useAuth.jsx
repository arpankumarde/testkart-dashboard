import { createContext, useContext, useState, useEffect } from "react";
import { server } from "../api";
import { useNavigate } from "react-router-dom";

// Create an authentication context
const AuthContext = createContext();

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// Hook for child components to get the auth object and re-render when it changes.
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(false);
  const navigate = useNavigate();

  // Check if user info is in local storage to keep user logged in after page refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser(true);
      navigate("/");
    }
  }, []);

  const login = async (email, password, type) => {
    try {
      const response = await server.post("/api/v1/auth/login", {
        email,
        password,
        type,
      });
      if (response.data.success) {
        console.log(response.data.message);
        localStorage.setItem("token", response.data.data.token);
        setUser(true);
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to login", error);
      alert(error.message);
    }
  };

  const logout = async () => {
    try {
      const response = await server.get("/auth/logout");
      if (response.data.success) {
        localStorage.removeItem("token");
        setUser(false);
        console.log(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.error("Failed to Logout", error);
      alert(error.message);
    }
  };

  return {
    user,
    login,
    logout,
  };
}
