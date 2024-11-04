import { useState, FormEvent } from "react";
import { useAuth } from "../hooks";
import { BiLoaderAlt } from "react-icons/bi";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password, "TEACHER");
      // Redirect to dashboard or desired page upon successful login
    } catch (err) {
      console.log("Login failed", err);
      // Handle login error
    }
    setLoading(false);
  };

  return (
    <div className="bg-[url('/static/images/login-bg.png')] bg-cover bg-center flex h-[calc(100dvh-4rem)]">
      <div className="w-0 lg:w-1/2"></div>
      <form
        className="flex flex-col items-center justify-center w-full lg:w-1/2 bg-white md:bg-opacity-10 backdrop-filter backdrop-blur-lg"
        onSubmit={handleLogin}
      >
        <div className="bg-white p-8 rounded-md flex flex-col gap-2 w-full md:w-96">
          <h1 className="text-2xl font-bold text-center">Welcome Back!</h1>
          <p className="text-center mb-8">
            The teacher dashboard will help you in creating test series and list
            it on marketplace
          </p>
          <input
            type="email"
            placeholder="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-200 bg-gray-100 active:bg-gray-200 rounded-md px-4 py-2 mb-2 outline-1"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-200 bg-gray-100 active:bg-gray-200 rounded-md px-4 py-2 mb-2"
            required
          />
          <button
            type="submit"
            className="bg-[#6d45a4] text-white rounded-md flex justify-center gap-2 px-4 py-2"
          >
            <BiLoaderAlt
              className={loading ? "inline animate-spin mt-0.5 " : "hidden"}
              size={20}
            />
            Log In
          </button>
          <span className="text-center">
            Don&apos;t have an account?
            <br />
            <Link
              to="/signup"
              className="text-[#6d45a4]/95 hover:text-[#6d45a4] font-medium"
            >
              Register as an Academy
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
