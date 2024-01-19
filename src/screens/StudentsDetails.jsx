import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks";
import { IoChevronBackOutline } from "react-icons/io5";
import { RiArrowDropDownLine } from "react-icons/ri";

const studentData = () => {
  const { user } = useAuth();
  const { stdid } = useParams();
  const navigate = useNavigate();

  const studentData = [
    {
      seriesName: "Dummy Test 1",
      status: "free",
      amount: 0,
      datetime: "2022-01-01T10:00:00Z",
    },
    {
      seriesName: "Dummy Test 2",
      status: "paid",
      amount: 10,
      datetime: "2022-01-02T10:00:00Z",
    },
    {
      seriesName: "Dummy Test 3",
      status: "free",
      amount: 0,
      datetime: "2022-01-03T10:00:00Z",
    },
    {
      seriesName: "Dummy Test 4",
      status: "paid",
      amount: 15,
      datetime: "2022-01-04T10:00:00Z",
    },
    {
      seriesName: "Dummy Test 5",
      status: "free",
      amount: 0,
      datetime: "2022-01-05T10:00:00Z",
    },
    {
      seriesName: "Dummy Test 6",
      status: "paid",
      amount: 20,
      datetime: "2022-01-06T10:00:00Z",
    },
    {
      seriesName: "Dummy Test 7",
      status: "free",
      amount: 0,
      datetime: "2022-01-07T10:00:00Z",
    },
    {
      seriesName: "Dummy Test 8",
      status: "paid",
      amount: 25,
      datetime: "2022-01-08T10:00:00Z",
    },
    {
      seriesName: "Dummy Test 9",
      status: "free",
      amount: 0,
      datetime: "2022-01-09T10:00:00Z",
    },
    {
      seriesName: "Dummy Test 10",
      status: "paid",
      amount: 30,
      datetime: "2022-01-10T10:00:00Z",
    },
    {
      seriesName: "Dummy Test 11",
      status: "free",
      amount: 0,
      datetime: "2022-01-11T10:00:00Z",
    },
    {
      seriesName: "Dummy Test 12",
      status: "paid",
      amount: 35,
      datetime: "2022-01-12T10:00:00Z",
    },
    {
      seriesName: "Dummy Test 13",
      status: "free",
      amount: 0,
      datetime: "2022-01-13T10:00:00Z",
    },
    {
      seriesName: "Dummy Test 14",
      status: "paid",
      amount: 40,
      datetime: "2022-01-14T10:00:00Z",
    },
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
              to="/students"
              className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200"
            >
              <i>
                <IoChevronBackOutline size={20} />
              </i>
            </Link>
            <span>Student Details</span>
          </h2>
          <hr className="my-4"/>
          <div className="min-h-96 h-full overflow-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white">
                <tr className="text-center">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Test Series</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Date & Time</th>
                </tr>
              </thead>
              <tbody
                className="text-gray-700 hover:[&>*]:text-gray-950 hover:[&>*]:bg-gray-100"
                onClick={() => setSecondaryTable((prev) => !prev)}
              >
                {studentData.map((test, index) => (
                  <tr className="text-center capitalize" key={index}>
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{test.seriesName}</td>
                    <td className="px-4 py-2">{test.status}</td>
                    <td className="px-4 py-2">
                      {test.amount == "0" ? "-" : test.amount}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(test.datetime).toLocaleString()}
                    </td>
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

export default studentData;
