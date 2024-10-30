import { useState } from "react";
import { useAuth } from "../hooks";
import { BiLoaderAlt } from "react-icons/bi";
import { Link } from "react-router-dom";

const Signup = () => {
  const [data, setData] = useState({
    academy_name: "",
    display_name: "",
    slug: "",
    contact_email: "",
    contact_phone: "",
    website: "",
    about: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    // make a slug from academy name
    const slug = data.academy_name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    setData({
      ...data,
      slug,
      display_name: data?.academy_name,
      about: ".",
      website: ".",
    });

    try {
      await signup(data);
      // Redirect to dashboard or desired page upon successful login
    } catch (err) {
      console.log("Login failed", err);
      // Handle signup error
    }
    setLoading(false);
  };

  return (
    <div className="bg-[url('/static/images/login-bg.png')] bg-cover bg-center flex h-[calc(100dvh-4rem)]">
      <div className="w-0 lg:w-1/2"></div>
      <form
        className="flex flex-col items-center justify-center w-full lg:w-1/2 bg-white md:bg-opacity-10 backdrop-filter backdrop-blur-lg"
        onSubmit={handleSignup}
      >
        {step === 1 && (
          <div className="bg-white p-8 rounded-md flex flex-col gap-2 w-full md:w-96">
            <h1 className="text-2xl font-bold text-center">Welcome Aboard!</h1>
            <p className="text-center mb-8">
              The teacher dashboard helps you create and list test series.
            </p>
            <input
              type="text"
              placeholder="Academy Name"
              value={data?.academy_name}
              onChange={(e) =>
                setData({ ...data, academy_name: e.target.value })
              }
              className="border border-gray-200 bg-gray-100 active:bg-gray-200 rounded-md px-4 py-2 mb-2 outline-1"
              required
            />

            <input
              type="email"
              placeholder="Academy Contact Email"
              value={data?.contact_email}
              onChange={(e) =>
                setData({ ...data, contact_email: e.target.value })
              }
              className="border border-gray-200 bg-gray-100 active:bg-gray-200 rounded-md px-4 py-2 mb-2 outline-1"
              required
            />

            <input
              type="text"
              placeholder="Academy Contact Phone"
              value={data?.contact_phone}
              onChange={(e) =>
                setData({ ...data, contact_phone: e.target.value })
              }
              className="border border-gray-200 bg-gray-100 active:bg-gray-200 rounded-md px-4 py-2 mb-2 outline-1"
              required
            />

            <button
              type="button"
              onClick={() => setStep(2)}
              className="bg-[#6d45a4] text-white rounded-md flex justify-center gap-2 px-4 py-2"
            >
              <BiLoaderAlt
                className={loading ? "inline animate-spin mt-0.5 " : "hidden"}
                size={20}
              />
              Next: Personal Info
            </button>
            <span className="text-center">
              Already have an account?
              <br />
              <Link
                to="/login"
                className="text-[#6d45a4]/95 hover:text-[#6d45a4] font-medium"
              >
                Login as an Academy
              </Link>
            </span>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white p-8 rounded-md flex flex-col gap-2 w-full md:w-96">
            <h1 className="text-2xl font-bold text-center">
              Academy Admin Details
            </h1>
            <p className="text-center mb-4">
              This will be your login details for this dashboard.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="First Name"
                value={data?.first_name}
                onChange={(e) =>
                  setData({ ...data, first_name: e.target.value })
                }
                className="border border-gray-200 bg-gray-100 active:bg-gray-200 rounded-md px-4 py-2 mb-2 outline-1 w-1/2"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={data?.last_name}
                onChange={(e) =>
                  setData({ ...data, last_name: e.target.value })
                }
                className="border border-gray-200 bg-gray-100 active:bg-gray-200 rounded-md px-4 py-2 mb-2 outline-1 w-1/2"
                required
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={data?.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="border border-gray-200 bg-gray-100 active:bg-gray-200 rounded-md px-4 py-2 mb-2 outline-1"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={data?.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              className="border border-gray-200 bg-gray-100 active:bg-gray-200 rounded-md px-4 py-2 mb-2"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={data?.confirm_password}
              onChange={(e) =>
                setData({ ...data, confirm_password: e.target.value })
              }
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
              Start Creating
            </button>
            <button
              type="submit"
              onClick={() => setStep(1)}
              className="text-[#6d45a4] border border-[#6d45a4] bg-gray-100 hover:bg-gray-200 rounded-md flex justify-center gap-2 px-4 py-2"
            >
              Previous Page
            </button>
            <span className="text-center">
              Already have an account?
              <br />
              <Link
                to="/login"
                className="text-[#6d45a4]/95 hover:text-[#6d45a4] font-medium"
              >
                Login as an Academy
              </Link>
            </span>
          </div>
        )}
      </form>
    </div>
  );
};

export default Signup;
