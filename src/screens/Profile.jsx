import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { server } from "../api";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(user ?? {});

  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (!user) return navigate("/login");

    setProfile(user);

    server
      .get(`/api/v1/studio/academy/${profile?.academy?.academy_id}`)
      .then((res) => {
        setProfile((prev) => ({ ...prev, academy: res.data.data }));
      })
      .catch((err) => {
        if (err.response.status === 401) logout();
        else console.log(err.response);
      });
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (
      !file.type.startsWith("image/jpeg") &&
      !file.type.startsWith("image/jpg") &&
      !file.type.startsWith("image/png")
    ) {
      alert("Please upload a JPG, JPEG, or PNG image file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("column_name", "logo");
    formData.append("table", "academy");
    formData.append("entity", "academy_id");
    formData.append("entity_id", profile?.academy?.academy_id);
    server
      .post("/api/v1/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.success) {
          alert("Logo uploaded successfully");
          setProfile((prevProfile) => ({
            ...prevProfile,
            academy: {
              ...prevProfile.academy,
              logo: res.data?.data?.url,
            },
          }));
        } else {
          alert("Failed to upload logo");
        }
      });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    console.log(profile);
    try {
      await server
        .post(
          `/api/v1/studio/academy/${profile?.academy?.academy_id}`,
          profile?.academy
        )
        .then(() => {
          localStorage.setItem("user", JSON.stringify(profile));
          alert("Profile updated successfully");
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
            <div className="flex flex-col items-start md:items-center gap-2 md:flex-row w-auto">
              <label htmlFor="logo">Academy Logo</label>
              <input
                type="file"
                id="logo"
                accept=".jpg, .jpeg, .png"
                onChange={handleFileChange}
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
          <div className="bg-white flex-1 flex flex-col gap-4 md:rounded-md p-4 pt-0 md:pt-4 md:mb-4 lg:mb-8 [&>*>label]:w-64">
            <div className="flex flex-col items-start md:items-center gap-2 md:flex-row w-auto">
              <label htmlFor="website">Website</label>
              <input
                type="url"
                id="website"
                className="bg-gray-100 border border-gray-200 outline-gray-300 w-full p-2 rounded-md"
                value={profile?.academy?.website}
                onChange={(e) =>
                  setProfile((prevProfile) => ({
                    ...prevProfile,
                    academy: {
                      ...prevProfile.academy,
                      website: e.target.value,
                    },
                  }))
                }
              />
            </div>
            <div className="flex flex-col items-start md:items-center gap-2 md:flex-row w-auto">
              <label htmlFor="yt">Youtube</label>
              <input
                type="url"
                id="yt"
                className="bg-gray-100 border border-gray-200 outline-gray-300 w-full p-2 rounded-md"
                value={profile?.academy?.yt}
                onChange={(e) =>
                  setProfile((prevProfile) => ({
                    ...prevProfile,
                    academy: {
                      ...prevProfile.academy,
                      yt: e.target.value,
                    },
                  }))
                }
              />
            </div>
            <div className="flex flex-col items-start md:items-center gap-2 md:flex-row w-auto">
              <label htmlFor="fb">Facebook</label>
              <input
                type="url"
                id="fb"
                className="bg-gray-100 border border-gray-200 outline-gray-300 w-full p-2 rounded-md"
                value={profile?.academy?.fb}
                onChange={(e) =>
                  setProfile((prevProfile) => ({
                    ...prevProfile,
                    academy: {
                      ...prevProfile.academy,
                      fb: e.target.value,
                    },
                  }))
                }
              />
            </div>
            <div className="flex flex-col items-start md:items-center gap-2 md:flex-row w-auto">
              <label htmlFor="tw">Twitter</label>
              <input
                type="url"
                id="tw"
                className="bg-gray-100 border border-gray-200 outline-gray-300 w-full p-2 rounded-md"
                value={profile?.academy?.tw}
                onChange={(e) =>
                  setProfile((prevProfile) => ({
                    ...prevProfile,
                    academy: {
                      ...prevProfile.academy,
                      tw: e.target.value,
                    },
                  }))
                }
              />
            </div>
            <div className="flex flex-col items-start md:items-center gap-2 md:flex-row w-auto">
              <label htmlFor="ig">Instagram</label>
              <input
                type="url"
                id="ig"
                className="bg-gray-100 border border-gray-200 outline-gray-300 w-full p-2 rounded-md"
                value={profile?.academy?.ig}
                onChange={(e) =>
                  setProfile((prevProfile) => ({
                    ...prevProfile,
                    academy: {
                      ...prevProfile.academy,
                      ig: e.target.value,
                    },
                  }))
                }
              />
            </div>
            <div className="flex flex-col items-start md:items-center gap-2 md:flex-row w-auto">
              <label htmlFor="wp">WhatsApp</label>
              <input
                type="url"
                id="wp"
                className="bg-gray-100 border border-gray-200 outline-gray-300 w-full p-2 rounded-md"
                value={profile?.academy?.wp}
                onChange={(e) =>
                  setProfile((prevProfile) => ({
                    ...prevProfile,
                    academy: {
                      ...prevProfile.academy,
                      wp: e.target.value,
                    },
                  }))
                }
              />
            </div>
            <div className="flex flex-col items-start md:items-center gap-2 md:flex-row w-auto">
              <label htmlFor="tg">Telegram</label>
              <input
                type="url"
                id="tg"
                className="bg-gray-100 border border-gray-200 outline-gray-300 w-full p-2 rounded-md"
                value={profile?.academy?.tg}
                onChange={(e) =>
                  setProfile((prevProfile) => ({
                    ...prevProfile,
                    academy: {
                      ...prevProfile.academy,
                      tg: e.target.value,
                    },
                  }))
                }
              />
            </div>
          </div>
        </div>
        <div className="bg-white md:bg-inherit px-4 md:px-0 pb-4 md:pb-0 flex justify-center pt-2">
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
