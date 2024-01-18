import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks";
import { IoChevronBackOutline } from "react-icons/io5";
import { RiArrowDropDownLine } from "react-icons/ri";

const TestReportsDetails = () => {
  const { user } = useAuth();
  const { seriesid } = useParams();
  const navigate = useNavigate();

  const testsData = [
    { name: "Dummy Test 1", attempted: 32, avgMarks: 75, avgTime: 45 },
    { name: "Dummy Test 2", attempted: 25, avgMarks: 80, avgTime: 50 },
    { name: "Dummy Test 3", attempted: 40, avgMarks: 85, avgTime: 55 },
    { name: "Dummy Test 4", attempted: 28, avgMarks: 70, avgTime: 40 },
    { name: "Dummy Test 5", attempted: 35, avgMarks: 90, avgTime: 60 },
    { name: "Dummy Test 6", attempted: 30, avgMarks: 78, avgTime: 48 },
    { name: "Dummy Test 7", attempted: 38, avgMarks: 82, avgTime: 52 },
    { name: "Dummy Test 8", attempted: 27, avgMarks: 73, avgTime: 42 },
    { name: "Dummy Test 9", attempted: 33, avgMarks: 88, avgTime: 58 },
    { name: "Dummy Test 10", attempted: 26, avgMarks: 76, avgTime: 46 },
    { name: "Dummy Test 11", attempted: 42, avgMarks: 92, avgTime: 62 },
    { name: "Dummy Test 12", attempted: 29, avgMarks: 79, avgTime: 49 },
    { name: "Dummy Test 13", attempted: 36, avgMarks: 87, avgTime: 57 },
    { name: "Dummy Test 14", attempted: 31, avgMarks: 81, avgTime: 53 },
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
          <div className="min-h-96 h-full overflow-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white">
                <tr className="text-center">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Test Name</th>
                  <th className="px-4 py-2">Attempted</th>
                  <th className="px-4 py-2">Avg Marks</th>
                  <th className="px-4 py-2">Avg Time Spent</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 hover:[&>*]:text-gray-950 hover:[&>*]:bg-gray-100">
                {testsData.map((test, index) => (
                  <tr className="text-center" key={index}>
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{test.name}</td>
                    <td className="px-4 py-2">{test.attempted}</td>
                    <td className="px-4 py-2">{test.avgMarks}</td>
                    <td className="px-4 py-2">{test.avgTime} mins</td>
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

export default TestReportsDetails;
