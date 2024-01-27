import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { server } from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(JSON.parse(user) || {});

  const [email, setEmail] = useState({
    id: profile.teacher_id,
    email: profile.email,
    new_email: "",
    confirm_email: "",
  });

  const [pass, setPass] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (!user) return navigate("/login");
  }, [user, navigate]);

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    if (email.new_email !== email.confirm_email)
      return alert("Emails do not match");
    if (email.new_email === email.email)
      return alert("New email cannot be same as current email");
    console.log(email);
    server
      .post(`/api/v1/studio/teachers/email/${profile?.teacher_id}`, email)
      .then((res) => {
        if (!res.data.success) {
          alert(res.data.error);
        } else {
          alert(res.data.message);
          setProfile({ ...profile, email: email.new_email });
          setEmail({
            ...email,
            email: email.new_email,
            new_email: "",
            confirm_email: "",
          });
          localStorage.setItem("user", JSON.stringify(profile));
          logout();
        }
      })
      .catch((err) => {
        if (err.response.status === 401) return logout();
        else console.log(err);
      });
  };

  const handlePassUpdate = async (e) => {
    e.preventDefault();
    if (pass.new_password !== pass.confirm_password)
      return alert("Passwords do not match");
    server
      .post(`/api/v1/studio/teachers/password/${profile?.teacher_id}`, pass)
      .then((res) => {
        if (!res.data.success) {
          toast.error(res.data.error, {
            position: "top-center",
          });
        } else {
          toast.warn(res.data.message);
          setPass({
            old_password: "",
            new_password: "",
            confirm_password: "",
          });
        }
      })
      .catch((err) => {
        if (err.response.status === 401) return logout();
        else console.log(err);
      });
  };

  return (
    <section className="md:p-4 lg:p-8">
      <div className="flex flex-col md:flex-row md:gap-4 lg:gap-8">
        <form onSubmit={handleEmailUpdate} className="flex flex-col w-full">
          <div className="bg-white flex-1 flex flex-col gap-4 md:rounded-md p-4 md:mb-4 lg:mb-8 [&>*>label]:w-64">
            <div className="flex flex-col items-start md:items-center gap-2 md:flex-row w-auto">
              <label htmlFor="current-email">Current Email</label>
              <input
                type="email"
                id="current-email"
                required
                value={email?.email}
                className="bg-gray-100 border border-gray-200 outline-gray-300 w-full p-2 rounded-md"
                disabled
              />
            </div>
            <div className="flex flex-col items-start md:items-center gap-2 md:flex-row w-auto">
              <label htmlFor="new-email">New Email</label>
              <input
                type="email"
                id="new-email"
                required
                value={email?.new_email}
                onChange={(e) =>
                  setEmail({
                    ...email,
                    new_email: e.target.value.toLowerCase(),
                  })
                }
                className="bg-gray-100 border border-gray-200 outline-gray-300 w-full p-2 rounded-md"
              />
            </div>
            <div className="flex flex-col items-start md:items-center gap-2 md:flex-row w-auto">
              <label htmlFor="confirm-new-email">Confirm New Email</label>
              <input
                type="email"
                id="confirm-new-email"
                required
                value={email?.confirm_email}
                onChange={(e) =>
                  setEmail({
                    ...email,
                    confirm_email: e.target.value.toLowerCase(),
                  })
                }
                className="bg-gray-100 border border-gray-200 outline-gray-300 w-full p-2 rounded-md"
              />
            </div>
          </div>
          <div className="bg-white md:bg-inherit px-4 md:px-0 pb-4 md:pb-0 flex justify-end pt-2">
            <button
              type="submit"
              className="bg-[#6d45a4] text-white w-full md:w-56 py-2 px-4 rounded-md"
            >
              Update Account Email
            </button>
          </div>
        </form>
        <hr className="md:hidden" />
        <form onSubmit={handlePassUpdate} className="flex flex-col w-full">
          <div className="bg-white flex-1 flex flex-col gap-4 md:rounded-md p-4 pt-2 md:pt-4 md:mb-4 lg:mb-8 [&>*>label]:w-64">
            <div className="flex flex-col items-start md:items-center gap-2 md:flex-row w-auto">
              <label htmlFor="current-pass">Current Password</label>
              <input
                type="password"
                id="current-pass"
                required
                minLength={8}
                value={pass?.old_password}
                onChange={(e) =>
                  setPass({ ...pass, old_password: e.target.value })
                }
                className="bg-gray-100 border border-gray-200 outline-gray-300 w-full p-2 rounded-md"
              />
            </div>
            <div className="flex flex-col items-start md:items-center gap-2 md:flex-row w-auto">
              <label htmlFor="new-pass">New Password</label>
              <input
                type="password"
                id="new-pass"
                required
                minLength={8}
                value={pass?.new_password}
                onChange={(e) =>
                  setPass({ ...pass, new_password: e.target.value })
                }
                className="bg-gray-100 border border-gray-200 outline-gray-300 w-full p-2 rounded-md"
              />
            </div>
            <div className="flex flex-col items-start md:items-center gap-2 md:flex-row w-auto">
              <label htmlFor="confirm-new-pass">Confirm New Password</label>
              <input
                type="password"
                id="confirm-new-pass"
                required
                minLength={8}
                value={pass?.confirm_password}
                onChange={(e) =>
                  setPass({ ...pass, confirm_password: e.target.value })
                }
                className="bg-gray-100 border border-gray-200 outline-gray-300 w-full p-2 rounded-md"
              />
            </div>
          </div>
          <div className="bg-white md:bg-inherit px-4 md:px-0 pb-4 md:pb-0 flex justify-end pt-2">
            <button
              type="submit"
              className="bg-[#6d45a4] text-white w-full md:w-56 py-2 px-4 rounded-md"
            >
              Update Account Password
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </section>
  );
};

export default Settings;
