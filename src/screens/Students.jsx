import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { PiStudentFill } from "react-icons/pi";
import { RiArrowDropDownLine } from "react-icons/ri";

const Students = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const studentsData = [
    {
      studentId: "STD00001",
      name: "John Doe",
      testSeriesBought: 2,
      amountSpent: 150,
    },
    {
      studentId: "STD00002",
      name: "Jane Smith",
      testSeriesBought: 1,
      amountSpent: 75,
    },
    {
      studentId: "STD00003",
      name: "Alice Johnson",
      testSeriesBought: 3,
      amountSpent: 200,
    },
    {
      studentId: "STD00004",
      name: "Bob Williams",
      testSeriesBought: 0,
      amountSpent: 0,
    },
    {
      studentId: "STD00005",
      name: "Emily Davis",
      testSeriesBought: 5,
      amountSpent: 400,
    },
    {
      studentId: "STD00006",
      name: "Michael Brown",
      testSeriesBought: 2,
      amountSpent: 150,
    },
    {
      studentId: "STD00007",
      name: "Olivia Wilson",
      testSeriesBought: 4,
      amountSpent: 300,
    },
    {
      studentId: "STD00008",
      name: "James Taylor",
      testSeriesBought: 1,
      amountSpent: 75,
    },
    {
      studentId: "STD00009",
      name: "Sophia Anderson",
      testSeriesBought: 3,
      amountSpent: 200,
    },
    {
      studentId: "STD00010",
      name: "Benjamin Martinez",
      testSeriesBought: 2,
      amountSpent: 150,
    },
    {
      studentId: "STD00011",
      name: "Ava Hernandez",
      testSeriesBought: 1,
      amountSpent: 75,
    },
    {
      studentId: "STD00012",
      name: "William Thompson",
      testSeriesBought: 4,
      amountSpent: 300,
    },
    {
      studentId: "STD00013",
      name: "Mia Garcia",
      testSeriesBought: 2,
      amountSpent: 150,
    },
    {
      studentId: "STD00014",
      name: "Liam Robinson",
      testSeriesBought: 3,
      amountSpent: 200,
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
            <i>
              <PiStudentFill size={25} />
            </i>
            <span>Students</span>
          </h2>
          <hr className="my-4" />
          <div className="min-h-96 h-full overflow-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white">
                <tr className="text-center">
                  <th className="px-4 py-2">Student ID</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Test Series Bought</th>
                  <th className="px-4 py-2">Amount Spent</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 hover:[&>*]:text-gray-950 hover:[&>*]:bg-gray-100">
                {studentsData.map((student, index) => (
                  <tr className="text-center" key={index}>
                    <td className="px-4 py-2 text-blue-600 hover:underline">
                      <Link to={`/students/${student.studentId}`}>
                        {student.studentId}
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-blue-600 hover:underline">
                      <Link to={`/students/${student.studentId}`}>
                        {student.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2">{student.testSeriesBought}</td>
                    <td className="px-4 py-2">{student.amountSpent}</td>
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

export default Students;
