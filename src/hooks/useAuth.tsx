import { createContext, useContext, useState, useEffect } from "react";
import { server } from "../api";
import { useNavigate } from "react-router-dom";

// Create an authentication context
const AuthContext = createContext();

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth().
export function ProvideAuth({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider value={useProvideAuth()}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for child components to get the auth object and re-render when it changes.
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider hook that creates auth object and handles state
const useProvideAuth = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  // Check if user info is in local storage to keep user logged in after page refresh
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const user = JSON.parse(localStorage.getItem("user") ?? "{}");

    if (token && user) {
      // Set Auth Header for future requests
      // server.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // server.defaults.headers.common["user_type"] = "TEACHER";

      setUser(user);
      // navigate("/");
    }
  }, []);

  const login = async (email: string, password: string, type: string) => {
    try {
      email = email.toLowerCase();
      type = type.toUpperCase();

      // Send login request to server
      const response = await server.post("/api/v1/auth/login", {
        email,
        password,
        type,
      });

      if (response?.data?.success) {
        // Store token and user info in local storage
        const token = response.data.data.token;
        const user = JSON.stringify(response.data.data.user);

        localStorage.setItem("access_token", token);
        localStorage.setItem("user", user);

        // Set Auth Header for future requests
        server.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        server.defaults.headers.common["user_type"] = "TEACHER";

        setUser(JSON.parse(user));
        navigate("/");
      } else {
        alert(response.data.error);
        console.log(response.data.error);
      }
    } catch (error) {
      console.error("Failed to login", error);
      alert("Failed to login");
    }
  };

  const signup = async (data) => {
    try {
      const response = await server.post("/api/v1/studio/academy", data);

      if (response?.data?.success) {
        alert("Signup successful. Please login to continue.");
        return navigate("/login");
      } else {
        alert(response.data.error);
        console.log(response.data.error);
      }
    } catch (error) {
      console.error("Failed to Signup", error);
      alert("Failed to Signup");
    }
  };

  const logout = async (redirect = true) => {
    try {
      // Send logout request to server
      const response = await server.get("/auth/logout");

      if (response?.data?.success) {
        // Remove token and user info from local storage
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");

        // Remove Auth Header from future requests
        delete server.defaults.headers.common["Authorization"];
        delete server.defaults.headers.common["user_type"];

        setUser(null);
        console.log(response.data.message);

        if (redirect) navigate("/login");
      }
    } catch (error) {
      console.error("Failed to Logout", error);
      alert("Failed to Logout");
    }
  };

  return {
    user,
    login,
    signup,
    logout,
  };
};
