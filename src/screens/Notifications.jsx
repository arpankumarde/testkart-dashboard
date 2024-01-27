import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { server } from "../api";
import { IoMdNotifications } from "react-icons/io";
import { BiLoaderAlt } from "react-icons/bi";

const Notifications = () => {
  const { user } = useAuth();
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
              <IoMdNotifications size={25} />
            </i>
            <span>Notifications</span>
          </h2>
          <hr className="my-4" />
          <div className="h-[calc(100dvh-10rem-0.6rem)] lg:h-[calc(100dvh-14rem-0.6rem)] overflow-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white border-b">
                <tr className="text-center">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Student Name</th>
                  <th className="px-4 py-2">Test Series Bought</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 hover:[&>*]:text-gray-950 hover:[&>*]:bg-gray-100">
                {notifications.length != 0 ? (
                  notifications.map((notification, index) => (
                    <tr className="text-center border-b" key={index}>
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:underline cursor-pointer">
                        {notification.student_name
                          ? notification.student_name
                          : "NA"}
                      </td>
                      <td className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:underline cursor-pointer">
                        {notification.test_series_name
                          ? notification.test_series_name
                          : "Untitled"}
                      </td>
                      <td className="px-4 py-2">
                        {notification.purchase_time
                          ? new Date(
                              notification.purchase_time
                            ).toLocaleString()
                          : "NA"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="text-center">
                    <td colSpan={5} className="px-4 py-2">
                      {loading ? (
                        <>
                          <span>Loading Notifications</span>
                          {"  "}
                          <BiLoaderAlt
                            className="inline animate-spin"
                            size={20}
                          />
                        </>
                      ) : (
                        "No Notifications found"
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Notifications;
