import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { RiArrowDropDownLine } from "react-icons/ri";

const TestReports = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const testSeriesData = [
    { testSeriesName: "Dummy Test Series 1", studentsJoined: 32 },
    { testSeriesName: "Dummy Test Series 2", studentsJoined: 25 },
    { testSeriesName: "Dummy Test Series 3", studentsJoined: 40 },
    { testSeriesName: "Dummy Test Series 4", studentsJoined: 28 },
    { testSeriesName: "Dummy Test Series 5", studentsJoined: 35 },
    { testSeriesName: "Dummy Test Series 6", studentsJoined: 30 },
    { testSeriesName: "Dummy Test Series 7", studentsJoined: 38 },
    { testSeriesName: "Dummy Test Series 8", studentsJoined: 27 },
    { testSeriesName: "Dummy Test Series 9", studentsJoined: 33 },
    { testSeriesName: "Dummy Test Series 10", studentsJoined: 26 },
    { testSeriesName: "Dummy Test Series 11", studentsJoined: 42 },
    { testSeriesName: "Dummy Test Series 12", studentsJoined: 29 },
    { testSeriesName: "Dummy Test Series 13", studentsJoined: 36 },
    { testSeriesName: "Dummy Test Series 14", studentsJoined: 31 },
  ];

  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (!user) return navigate("/login");
  }, [user, navigate]);

  return (
    <section className="md:p-4 lg:p-8">
      <div className="flex flex-col md:flex-row md:gap-4 lg:gap-8">
        <div className="bg-white md:rounded-md p-4 flex-1">
          <h2 className="text-xl flex items-center gap-2">
            <i>
              <HiOutlineDocumentReport size={25} />
            </i>
            <span>Test Reports</span>
          </h2>
          <hr className="my-4" />
          <div className="min-h-96 h-full overflow-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white">
                <tr className="text-center">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Test Series</th>
                  <th className="px-4 py-2">No. of Students Joined</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 hover:[&>*]:text-gray-950 hover:[&>*]:bg-gray-100">
                {testSeriesData.map((test, index) => (
                  <tr className="text-center" key={index}>
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2 text-blue-600 hover:underline">
                      <Link to={`/test-reports/${index + 1}`}>
                        {test.testSeriesName}
                      </Link>
                    </td>
                    <td className="px-4 py-2">{test.studentsJoined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestReports;
