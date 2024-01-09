import { useState } from "react";
import { useAuth } from "../hooks";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password, "TEACHER");
      // Redirect to dashboard or desired page upon successful login
    } catch (error) {
      console.log("Login failed", error);
      // Handle login error
    }
  };

  return (
    <form
      className="flex flex-col items-center justify-center h-screen"
      onSubmit={handleLogin}
    >
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-gray-300 rounded-md px-4 py-2 mb-2"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border border-gray-300 rounded-md px-4 py-2 mb-2"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white rounded-md px-4 py-2"
      >
        Login
      </button>
    </form>
  );
};

export default Login;
