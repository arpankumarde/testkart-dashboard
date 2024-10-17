import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks";
import { server } from "../api";
import { IoChevronBackOutline } from "react-icons/io5";
import { BiLoaderAlt } from "react-icons/bi";

const TestReportsDetails = () => {
  const { user } = useAuth();
  const { seriesid } = useParams();
  const navigate = useNavigate();

  const [testReport, setTestReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (!user) return navigate("/login");

    server
      .get(`/api/v1/studio/academy/test-report/${seriesid}`)
      .then((res) => {
        setTestReport(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [user, navigate, seriesid]);

  return (
    <section className="md:p-4 lg:p-8">
      <div className="flex flex-col md:flex-row md:gap-4 lg:gap-8">
        <div className="bg-white md:rounded-md p-4 flex-1">
          <h2 className="text-xl flex items-center gap-2">
            <Link
              to="/test-reports"
              className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200"
            >
              <i>
                <IoChevronBackOutline size={20} />
              </i>
            </Link>
            <span>Test Reports</span>
          </h2>
          <hr className="my-4" />
          <div className="h-[calc(100dvh-10rem-0.6rem)] lg:h-[calc(100dvh-14rem-0.6rem)] overflow-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white border-b">
                <tr className="text-center">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Test ID</th>
                  <th className="px-4 py-2">Test Name</th>
                  <th className="px-4 py-2">Attempted</th>
                  <th className="px-4 py-2">Avg Marks</th>
                  <th className="px-4 py-2">Avg Time Spent</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 hover:[&>*]:text-gray-950 hover:[&>*]:bg-gray-100">
                {testReport.length != 0 ? (
                  testReport.map((test, index) => (
                    <tr className="text-center border-b" key={index}>
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">
                        {test.test_id ? test.test_id : "NA"}
                      </td>
                      <td className="px-4 py-2">
                        {test.title ? test.title : "Untitled"}
                      </td>
                      <td className="px-4 py-2">
                        {test.total_attempts ? test.total_attempts : 0}
                      </td>
                      <td className="px-4 py-2">
                        {parseFloat(test?.obtained_marks ?? 0).toFixed(2) ?? 0}
                      </td>
                      <td className="px-4 py-2">
                        {parseFloat(test?.time_spent ?? 0).toFixed(2) ?? 0} mins
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="text-center">
                    <td colSpan={6} className="px-4 py-2">
                      {loading ? (
                        <>
                          <span>Loading Test Reports</span>
                          {"  "}
                          <BiLoaderAlt
                            className="inline animate-spin"
                            size={20}
                          />
                        </>
                      ) : (
                        "No Tests found"
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

export default TestReportsDetails;
