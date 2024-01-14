import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { server } from "../api";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(JSON.parse(user) || {});

  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (!user) return navigate("/login");

    server
      .get(`/api/v1/studio/academy/${profile.academy.academy_id}`)
      .catch((err) => {
        if (err.response.status === 401) logout();
        else console.log(err.response);
      });
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await server
        .post(
          `/api/v1/studio/academy/${profile.academy.academy_id}`,
          profile.academy
        )
        .then(() => {
          localStorage.setItem("user", JSON.stringify(profile));
        })
        .catch((err) => {
          if (err.response.status === 401) logout();
          else console.log(err.response);
        });
    } catch (error) {
      console.log("failed to update Academy Details: ", error);
    }
  };

  return (
    <section className="md:p-4 lg:p-8">
      <form onSubmit={handleProfileUpdate}>
        <div className="flex flex-col md:flex-row md:gap-4 lg:gap-8">
          <div className="bg-white flex-1 flex flex-col gap-4 md:rounded-md p-4 md:mb-4 lg:mb-8 [&>*>label]:w-64">
            <div className="flex flex-col items-start md:items-center gap-2 md:flex-row w-auto">
              <label htmlFor="type">Profile type</label>
              <select
                id="type"
                defaultValue="individual"
                required
                disabled
                className="bg-gray-100 border border-gray-200 outline-gray-300 w-full p-2 rounded-md"
              >
                <option value="individual">Individual</option>
                <option value="institutional">Institutional</option>
              </select>
            </div>
            <div className="flex flex-col items-start md:items-center gap-2 md:flex-row w-auto">
              <label htmlFor="name">Display Name</label>
              <input
                type="text"
                id="name"
                required
                className="bg-gray-100 border border-gray-200 outline-gray-300 w-full p-2 rounded-md"
                value={profile?.academy?.display_name}
                onChange={(e) =>
                  setProfile((prevProfile) => ({
                    ...prevProfile,
                    academy: {
                      ...prevProfile.academy,
                      display_name: e.target.value,
                    },
                  }))
                }
              />
            </div>
            <div className="flex flex-col items-start md:items-center gap-2 md:flex-row w-auto">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                required
                className="bg-gray-100 border border-gray-200 outline-gray-300 w-full p-2 rounded-md"
                value={profile?.academy?.contact_email}
                onChange={(e) =>
                  setProfile((prevProfile) => ({
                    ...prevProfile,
                    academy: {
                      ...prevProfile.academy,
                      contact_email: e.target.value,
                    },
                  }))
                }
              />
            </div>
            <div className="flex flex-col items-start md:items-center gap-2 md:flex-row w-auto">
              <label htmlFor="tel">Phone Number</label>
              <input
                type="tel"
                id="phone"
                required
                className="bg-gray-100 border border-gray-200 outline-gray-300 w-full p-2 rounded-md"
                value={profile?.academy?.contact_phone}
                onChange={(e) =>
                  setProfile((prevProfile) => ({
                    ...prevProfile,
                    academy: {
                      ...prevProfile.academy,
                      contact_phone: e.target.value,
                    },
                  }))
                }
              />
            </div>
          </div>
          <div className="bg-white flex-1 flex flex-col gap-4 md:rounded-md p-4 max-md:pt-0 md:mb-4 lg:mb-8 [&>*>label]:w-64">
            <div className="flex flex-col items-start md:items-center gap-2 md:flex-row w-auto">
              <label htmlFor="logo">Academy Logo</label>
              <input
                type="file"
                id="logo"
                accept=".jpg, .jpeg, .png"
                className="bg-gray-100 border border-gray-200 outline-gray-300 w-full p-2 rounded-md"
              />
            </div>
            <div className="flex flex-col items-start gap-2 md:flex-row w-auto">
              <label htmlFor="about" className="md:mt-2">
                About Academy
              </label>
              <textarea
                id="about"
                required
                className="bg-gray-100 border border-gray-200 outline-gray-300 w-full p-2 rounded-md h-36 resize-none"
                value={profile?.academy?.about}
                maxLength={150}
                onChange={(e) =>
                  setProfile((prevProfile) => ({
                    ...prevProfile,
                    academy: {
                      ...prevProfile.academy,
                      about: e.target.value.slice(0, 150),
                    },
                  }))
                }
              />
            </div>
          </div>
        </div>
        <div className="max-md:bg-white max-md:px-4 max-md:pb-4 flex justify-end">
          <button
            type="submit"
            className="bg-[#6d45a4] text-white w-full md:w-64 py-2 px-4 rounded-md"
          >
            Update Academy Profile
          </button>
        </div>
      </form>
    </section>
  );
};

export default Profile;
