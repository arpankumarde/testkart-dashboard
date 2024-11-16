import { useState } from "react";
import { useAuth } from "../hooks";
import { BiLoaderAlt } from "react-icons/bi";
import { Link } from "react-router-dom";
import { BsBuildings } from "react-icons/bs";
import { PiUserCircle } from "react-icons/pi";
import { toast } from "react-toastify";

const Signup = () => {
  const [data, setData] = useState({
    academy_name: "",
    display_name: "",
    slug: "",
    contact_email: "",
    contact_phone: "",
    website: "/",
    about: ".",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // make a slug from academy name
    const slug = data?.academy_name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    if (data.password !== data.confirm_password) {
      toast.error("Password and Confirm Password fields do not match!", {
        theme: "light",
      });
      setLoading(false);
      return;
    }

    setData({
      ...data,
      slug,
      display_name: data?.academy_name,
    });

    try {
      await signup({ ...data, slug, display_name: data?.academy_name });
      // Redirect to dashboard or desired page upon successful login
    } catch (err) {
      console.log("Login failed", err);
      toast.error("Signup failed!", {
        theme: "light",
      });
      // Handle signup error
    }
    setLoading(false);
  };

  return (
    <>
      <section className="bg-[url('/static/images/login-bg.png')] bg-cover bg-center md:p-4 lg:p-8 h-[calc(100dvh-4rem)]">
        <div className="flex flex-col md:flex-row md:gap-4 lg:gap-8">
          <form
            className="bg-white md:rounded-md p-4 flex flex-col flex-1"
            onSubmit={handleSignup}
          >
            <div>
              <h2 className="h-10 text-2xl text-center">
                <span>Academy Signup</span>
              </h2>
            </div>
            <div className="flex flex-col md:flex-row w-full">
              <div className="flex-1">
                <div className="md:h-[calc(100dvh-10rem-0.6rem)] lg:h-[calc(100dvh-14rem-0.6rem)] overflow-auto text-gray-700">
                  <h2 className="text-xl flex justify-center items-center gap-2">
                    <i className="p-2">
                      <BsBuildings size={20} />
                    </i>
                    <span>Academy Details</span>
                  </h2>
                  <span className="block text-center">
                    These information will be public
                  </span>
                  <hr className="my-4" />

                  <div className="p-2 md:p-4 lg:p-8 flex flex-col gap-2 w-full md:w-96 mx-auto">
                    <label htmlFor="academy_name">Academy Name</label>
                    <input
                      type="text"
                      placeholder="Academy Name"
                      id="academy_name"
                      value={data?.academy_name}
                      onChange={(e) =>
                        setData({ ...data, academy_name: e.target.value })
                      }
                      className="border border-gray-200 bg-gray-100 active:bg-gray-200 rounded-md px-4 py-2 mb-2 outline-1"
                      required
                    />

                    <label htmlFor="contact_email">Academy Contact Email</label>
                    <input
                      type="email"
                      placeholder="Academy Contact Email"
                      id="contact_email"
                      value={data?.contact_email}
                      onChange={(e) =>
                        setData({ ...data, contact_email: e.target.value })
                      }
                      className="border border-gray-200 bg-gray-100 active:bg-gray-200 rounded-md px-4 py-2 mb-2 outline-1"
                      required
                    />

                    <label htmlFor="contact_phone">Academy Contact Phone</label>
                    <input
                      type="text"
                      placeholder="Academy Contact Phone"
                      id="contact_phone"
                      value={data?.contact_phone}
                      onChange={(e) =>
                        setData({ ...data, contact_phone: e.target.value })
                      }
                      className="border border-gray-200 bg-gray-100 active:bg-gray-200 rounded-md px-4 py-2 mb-2 outline-1"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl flex justify-center items-center gap-2">
                  <i className="p-2">
                    <PiUserCircle size={20} />
                  </i>
                  <span>Academy Admin Details</span>
                </h2>
                <span className="block text-center">
                  This will be your login details for this dashboard.
                </span>
                <hr className="my-4" />

                <div className="p-2 md:p-4 lg:p-8 flex flex-col gap-2 w-full md:w-96 mx-auto">
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
                    onChange={(e) =>
                      setData({ ...data, email: e.target.value })
                    }
                    className="border border-gray-200 bg-gray-100 active:bg-gray-200 rounded-md px-4 py-2 mb-2 outline-1"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={data?.password}
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
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
                </div>
                <div className="p-4 flex items-center gap-4 justify-end">
                  <span className="text-center block text-xs">
                    Already have an account?
                    <br />
                    <Link
                      to="/login"
                      className="text-[#6d45a4]/95 hover:text-[#6d45a4] font-medium"
                    >
                      Login as an Academy
                    </Link>
                  </span>

                  <button
                    type="submit"
                    className="bg-[#6d45a4] text-white rounded-md flex justify-center gap-2 px-4 py-2"
                  >
                    <BiLoaderAlt
                      className={
                        loading ? "inline animate-spin mt-0.5 " : "hidden"
                      }
                      size={20}
                    />
                    Start Creating
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Signup;
