import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(JSON.parse(user) || {});

  const handleSettingsUpdate = async (e) => {
    e.preventDefault();
    console.log("Settings updated");
  };

  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (!user) return navigate("/login");
  }, [user, navigate]);

  return (
    <section className="md:p-4 lg:p-8">
      <form onSubmit={handleSettingsUpdate}>
        <div className="flex flex-col md:flex-row md:gap-4 lg:gap-8">
          <div className="bg-white flex-1 flex flex-col gap-4 md:rounded-md p-4 md:mb-4 lg:mb-8 [&>*>label]:w-64">
            <div className="flex flex-col items-start md:items-center gap-2 md:flex-row w-auto">
              <label htmlFor="current-email">Current Email</label>
              <input
                type="email"
                id="current-email"
                required
                className="bg-gray-100 border border-gray-200 outline-gray-300 w-full p-2 rounded-md"
                value={profile?.academy?.contact_email}
                disabled
              />
            </div>
            <div className="flex flex-col items-start md:items-center gap-2 md:flex-row w-auto">
              <label htmlFor="new-email">New Email</label>
              <input
                type="email"
                id="new-email"
                required
                className="bg-gray-100 border border-gray-200 outline-gray-300 w-full p-2 rounded-md"
              />
            </div>
          </div>
          <div className="bg-white flex-1 flex flex-col gap-4 md:rounded-md p-4 max-md:pt-0 md:mb-4 lg:mb-8 [&>*>label]:w-64">
            <div className="flex flex-col items-start md:items-center gap-2 md:flex-row w-auto">
              <label htmlFor="current-pass">Current password</label>
              <input
                type="password"
                id="current-pass"
                required
                minLength={8}
                className="bg-gray-100 border border-gray-200 outline-gray-300 w-full p-2 rounded-md"
              />
            </div>
            <div className="flex flex-col items-start gap-2 md:flex-row w-auto">
              <label htmlFor="new-pass">New Password</label>
              <input
                type="password"
                id="new-pass"
                required
                minLength={8}
                className="bg-gray-100 border border-gray-200 outline-gray-300 w-full p-2 rounded-md"
              />
            </div>
          </div>
        </div>
        <div className="max-md:bg-white max-md:px-4 max-md:pb-4 flex justify-end pt-2">
          <button
            type="submit"
            className="bg-[#6d45a4] text-white w-full md:w-64 py-2 px-4 rounded-md"
          >
            Update Account Settings
          </button>
        </div>
      </form>
    </section>
  );
};

export default Settings;
