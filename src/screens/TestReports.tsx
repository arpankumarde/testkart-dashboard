import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { server } from "../api";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { BiLoaderAlt } from "react-icons/bi";

const TestReports = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [testSeriesReport, setTestSeriesReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (!user) return navigate("/login");

    server
      .get("/api/v1/studio/academy/series-report/")
      .then((res) => {
        setTestSeriesReport(res.data.data);
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
              <HiOutlineDocumentReport size={20} />
            </i>
            <span>Test Reports</span>
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
                  <th className="px-4 py-2 min-w-40">
                    <span className="hidden lg:inline">Test</span>
                    {"  "}Series Name
                  </th>
                  <th className="px-4 py-2">Students Joined</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 hover:[&>*]:text-gray-950 hover:[&>*]:bg-gray-100">
                {testSeriesReport.length != 0 ? (
                  testSeriesReport.map((test, index) => (
                    <tr className="text-center border-b" key={index}>
                      <td className="px-4 py-2">{index + 1}</td>
                      <td
                        className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                        onClick={() =>
                          navigate(`/test-reports/${test.test_series_id}`)
                        }
                      >
                        {test.test_series_id ? test.test_series_id : "NA"}
                      </td>
                      <td
                        className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                        onClick={() =>
                          navigate(`/test-reports/${test.test_series_id}`)
                        }
                      >
                        {test.title ? test.title : "Untitled"}
                      </td>
                      <td className="px-4 py-2">
                        {test.students_joined ? test.students_joined : 0}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="text-center">
                    <td colSpan={4} className="px-4 py-2">
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
                        "No test series found"
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

export default TestReports;
