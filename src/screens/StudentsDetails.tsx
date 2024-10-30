import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks";
import { server } from "../api";
import { IoChevronBackOutline } from "react-icons/io5";
import { BiLoaderAlt } from "react-icons/bi";

const studentData = () => {
  const { user } = useAuth();
  const { stdid } = useParams();
  const navigate = useNavigate();

  const [studentTestData, setStudentTestData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (!user) return navigate("/login");

    server
      .get(`/api/v1/studio/academy/student-report/${stdid}`)
      .then((res) => {
        setStudentTestData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [user, navigate, stdid]);

  return (
    <section className="md:p-4 lg:p-8">
      <div className="flex flex-col md:flex-row md:gap-4 lg:gap-8">
        <div className="bg-white md:rounded-md p-4 flex-1">
          <h2 className="text-xl flex items-center gap-2">
            <Link
              to="/students"
              className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200"
            >
              <i>
                <IoChevronBackOutline size={20} />
              </i>
            </Link>
            <span>Student Details</span>
          </h2>
          <hr className="my-4" />
          <div className="h-[calc(100dvh-10rem-0.6rem)] lg:h-[calc(100dvh-14rem-0.6rem)] overflow-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white border-b">
                <tr className="text-center">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">
                    <span className="hidden lg:inline">Test</span>
                    {"  "}Series ID
                  </th>
                  <th className="px-4 py-2">
                    <span className="hidden lg:inline">Test</span>
                    {"  "}Series Name
                  </th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Purchase Date</th>
                </tr>
              </thead>
              <tbody
                className="text-gray-700 hover:[&>*]:text-gray-950 hover:[&>*]:bg-gray-100"
                onClick={() => setSecondaryTable((prev) => !prev)}
              >
                {studentTestData.length != 0 ? (
                  studentTestData.map((test, index) => (
                    <tr className="text-center capitalize border-b" key={index}>
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">
                        {test.test_series_id ? test.test_series_id : "NA"}
                      </td>
                      <td className="px-4 py-2">
                        {test.test_sery.title
                          ? test.test_sery.title
                          : "Untitled"}
                      </td>
                      <td className="px-4 py-2">
                        {test.is_paid == 0 ? "Free" : "Paid"}
                      </td>
                      <td className="px-4 py-2">
                        {test.test_sery.is_paid == 0
                          ? test.test_sery.price
                          : "-"}
                      </td>
                      <td className="px-4 py-2">
                        {test.purchase_time
                          ? new Date(test.purchase_time).toLocaleString()
                          : "NA"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="text-center">
                    <td colSpan={6} className="px-4 py-2">
                      {loading ? (
                        <>
                          <span>Loading Test Series</span>
                          {"  "}
                          <BiLoaderAlt
                            className="inline animate-spin"
                            size={20}
                          />
                        </>
                      ) : (
                        "No Test Series found"
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

export default studentData;
