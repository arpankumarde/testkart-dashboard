import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { server } from "../api";
import { IoMdNotifications } from "react-icons/io";
import { BiLoaderAlt } from "react-icons/bi";

const Notifications = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState([true]);

  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (!user) return navigate("/login");

    server
      .get("/api/v1/studio/academy/notification")
      .then((res) => {
        setNotifications(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response.status === 401) return logout();
        console.log(err);
        setLoading(false);
      });
  }, [user, navigate]);

  return (
    <section className="md:p-4 lg:p-8">
      <div className="flex flex-col md:flex-row md:gap-4 lg:gap-8">
        <div className="bg-white md:rounded-md p-4 flex-1">
          <h2 className="text-xl flex items-center gap-2">
            <i className="p-2">
              <IoMdNotifications size={20} />
            </i>
            <span>Notifications</span>
          </h2>
          <hr className="my-4" />
          <div className="h-[calc(100dvh-10rem-0.6rem)] lg:h-[calc(100dvh-14rem-0.6rem)] overflow-auto text-gray-700 hover:[&>*]:text-gray-950 hover:[&>*]:bg-gray-100">
            {notifications.length != 0 ? (
              notifications.map((notification, index) => (
                <p className="border-b px-4 py-2 rounded-md" key={index}>
                  {`${index + 1}. ${
                    notification.student_name ? notification.student_name : "NA"
                  } bought ${
                    notification.test_series_name
                      ? notification.test_series_name
                      : "Untitled"
                  } at ${
                    notification.purchase_time
                      ? new Date(notification.purchase_time).toLocaleString()
                      : "NA"
                  }`}
                </p>
              ))
            ) : (
              <p className="px-4 py-2 text-center">
                {loading ? (
                  <>
                    <span>Loading Notifications</span>
                    {"  "}
                    <BiLoaderAlt className="inline animate-spin" size={20} />
                  </>
                ) : (
                  "No Notifications found"
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Notifications;
